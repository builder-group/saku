import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

const GET_SHOP_CURRENCY_CODE = gql(`
	query getShopCurrencyCode {
		shop {
			currencyCode
		}
	}
`);

const GET_PRODUCT_BY_ID = gql(`
	query getProductById($id: ID!, $variantsAfter: String, $mediaAfter: String) {
		product(id: $id) {
			id
			title
			descriptionHtml
			options {
				name
				values
			}
			media(first: 100, after: $mediaAfter) {
				edges {
					node {
						... on MediaImage {
							__typename
							image {
								url
								altText
							}
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
			variants(first: 100, after: $variantsAfter) {
				edges {
					node {
						id
						title
						price
						selectedOptions {
							name
							value
						}
						image {
							url
							altText
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}
`);

export async function getProductsByIds(
	ids: string[],
	config: TGetProductsByIdsConfig
): Promise<TResult<TGetProductsByIdsSuccess, AppError>> {
	if (!ids.length) {
		return Ok({ products: [] });
	}

	const currencyCodeResult = await shopifyAdminApiClient.query(GET_SHOP_CURRENCY_CODE, {
		prefixUrl: shopifyConfig.shop.adminApi(config.shopId),
		headers: {
			'X-Shopify-Access-Token': config.accessToken
		}
	});
	if (currencyCodeResult.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
				detail: `Shopify API request failed: ${currencyCodeResult.error.message}`
			})
		);
	}

	const currencyCode = currencyCodeResult.value.data.shop.currencyCode;
	const products: TGetProductsByIdsSuccess['products'] = [];

	// Fetch each product separately so we can fully paginate variants and media without
	// truncating large Shopify products.
	for (const id of ids) {
		const productResult = await getProductById(id, currencyCode, config);
		if (productResult.isErr()) {
			return Err(productResult.error);
		}
		if (productResult.value != null) {
			products.push(productResult.value);
		}
	}

	return Ok({ products });
}

async function getProductById(
	id: string,
	currencyCode: string,
	config: TGetProductsByIdsConfig
): Promise<TResult<TGetProductsByIdsSuccess['products'][number] | null, AppError>> {
	let variantsAfter: string | null = null;
	let mediaAfter: string | null = null;
	let hasNextVariantsPage = true;
	let hasNextMediaPage = true;

	let title: string | null = null;
	let descriptionHtml: string | null = null;
	let options: { name: string; values: string[] }[] = [];
	const images: TGetProductsByIdsSuccess['products'][number]['images'] = [];
	const imageUrls = new Set<string>();
	const variants: TGetProductsByIdsSuccess['products'][number]['variants'] = [];
	const variantIds = new Set<string>();

	// Keep requesting until both connections are exhausted so snapshot refresh stays complete
	// for products with many variants or media entries
	while (hasNextVariantsPage || hasNextMediaPage) {
		const result: TAdminQueryResult = await shopifyAdminApiClient.query(GET_PRODUCT_BY_ID, {
			prefixUrl: shopifyConfig.shop.adminApi(config.shopId),
			variables: {
				id,
				variantsAfter,
				mediaAfter
			},
			headers: {
				'X-Shopify-Access-Token': config.accessToken
			}
		});
		if (result.isErr()) {
			return Err(
				new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
					detail: `Shopify API request failed: ${result.error.message}`
				})
			);
		}

		const data = result.value.data as TGetProductByIdData;
		const product: TAdminProduct | null = data.product;
		if (product == null) {
			return Ok(null);
		}

		title = title ?? product.title;
		descriptionHtml = descriptionHtml ?? product.descriptionHtml;
		options = product.options.map((option: { name: string; values: string[] }) => ({
			name: option.name,
			values: option.values
		}));

		for (const mediaEdge of product.media.edges) {
			const media = mediaEdge.node;
			if (media.image == null) {
				continue;
			}
			if (imageUrls.has(media.image.url)) {
				continue;
			}

			imageUrls.add(media.image.url);
			images.push({
				url: media.image.url,
				altText: media.image.altText ?? undefined
			});
		}

		for (const variantEdge of product.variants.edges) {
			const variant = variantEdge.node;
			if (variantIds.has(variant.id)) {
				continue;
			}

			variantIds.add(variant.id);
			variants.push({
				id: variant.id,
				title: variant.title,
				price: {
					amount: variant.price,
					currencyCode
				},
				image:
					variant.image != null
						? {
								url: variant.image.url,
								altText: variant.image.altText ?? undefined
							}
						: undefined,
				selectedOptions: variant.selectedOptions.map((option: { name: string; value: string }) => ({
					name: option.name,
					value: option.value
				}))
			});
		}

		hasNextVariantsPage = product.variants.pageInfo.hasNextPage;
		hasNextMediaPage = product.media.pageInfo.hasNextPage;
		variantsAfter = product.variants.pageInfo.endCursor ?? null;
		mediaAfter = product.media.pageInfo.endCursor ?? null;
	}

	return Ok({
		id,
		title: title ?? '',
		descriptionHtml: descriptionHtml ?? '',
		images,
		options,
		variants
	});
}

interface TAdminProduct {
	id: string;
	title: string;
	descriptionHtml: string;
	options: { name: string; values: string[] }[];
	media: {
		edges: {
			node: {
				__typename?: 'MediaImage';
				image?: {
					url: string;
					altText: string | null;
				} | null;
			};
		}[];
		pageInfo: {
			hasNextPage: boolean;
			endCursor: string | null;
		};
	};
	variants: {
		edges: {
			node: {
				id: string;
				title: string;
				price: string;
				selectedOptions: { name: string; value: string }[];
				image: {
					url: string;
					altText: string | null;
				} | null;
			};
		}[];
		pageInfo: {
			hasNextPage: boolean;
			endCursor: string | null;
		};
	};
}

interface TGetProductByIdData {
	product: TAdminProduct | null;
}

interface TGetProductsByIdsConfig {
	shopId: string;
	accessToken: string;
}

type TAdminQueryResult = Awaited<ReturnType<typeof shopifyAdminApiClient.query>>;

export interface TGetProductsByIdsSuccess {
	products: {
		id: string;
		title: string;
		descriptionHtml: string;
		images: {
			url: string;
			altText?: string;
		}[];
		options: { name: string; values: string[] }[];
		variants: {
			id: string;
			title: string;
			price: { amount: string; currencyCode: string };
			image?: {
				url: string;
				altText?: string;
			};
			selectedOptions: { name: string; value: string }[];
		}[];
	}[];
}

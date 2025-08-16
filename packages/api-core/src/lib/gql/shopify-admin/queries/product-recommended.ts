import { notEmpty } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/products
export const RECOMMENDED_PRODUCTS = gql(`
	query recommendedProducts($first: Int = 8, $sortKey: ProductSortKeys, $reverse: Boolean) {
		products(first: $first, sortKey: $sortKey, reverse: $reverse) {
			edges {
				node {
					id
					title
					options {
						name
						values
					}
					variants(first: 10) {
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
					}
					media(first: 5) {
						edges {
							node {
								... on MediaImage {
									image {
										url
										altText
									}
								}
							}
						}
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`);

export async function getRecommendedProducts(
	input: TGetRecommendedProductsInput,
	config: TGetRecommendedProductsConfig
): Promise<TResult<TGetRecommendedProductsSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const { first = 8, sortKey = 'CREATED_AT', reverse = true } = input;

	const result = await shopifyAdminApiClient.query(RECOMMENDED_PRODUCTS, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			first,
			sortKey,
			reverse
		},
		headers: {
			'X-Shopify-Access-Token': accessToken
		}
	});
	if (result.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
				detail: `Shopify API request failed: ${result.error.message}`
			})
		);
	}

	const products = result.value.data.products;
	return Ok({
		products: products.edges.map((edge) => {
			const product = edge.node;

			return {
				id: product.id,
				title: product.title,
				images: product.media.edges
					.map((mediaEdge) => {
						const media = mediaEdge.node;
						if (media.__typename === 'MediaImage' && media.image != null) {
							return {
								url: media.image.url,
								altText: media.image.altText ?? undefined
							};
						}
						return null;
					})
					.filter(notEmpty),
				options: product.options.map((option) => ({
					name: option.name,
					values: option.values
				})),
				variants: product.variants.edges.map((variantEdge) => {
					const variant = variantEdge.node;
					return {
						id: variant.id,
						title: variant.title,
						price: {
							amount: variant.price,
							currencyCode: 'USD'
						},
						image:
							variant.image != null
								? {
										url: variant.image.url,
										altText: variant.image.altText ?? undefined
									}
								: undefined,
						selectedOptions: variant.selectedOptions.map((option) => ({
							name: option.name,
							value: option.value
						}))
					};
				})
			};
		}),
		pageInfo: {
			hasNextPage: products.pageInfo.hasNextPage,
			endCursor: products.pageInfo.endCursor ?? undefined
		}
	});
}

interface TGetRecommendedProductsConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetRecommendedProductsInput {
	first?: number;
	sortKey?: 'CREATED_AT' | 'ID' | 'RELEVANCE' | 'TITLE' | 'UPDATED_AT' | 'VENDOR';
	reverse?: boolean;
}

export interface TGetRecommendedProductsSuccess {
	products: {
		id: string;
		title: string;
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
	pageInfo: {
		hasNextPage: boolean;
		endCursor?: string;
	};
}

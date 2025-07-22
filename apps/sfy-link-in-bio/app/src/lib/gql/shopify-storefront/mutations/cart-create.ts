import { Err, Ok, type TResult } from '@blgc/utils';
import { gql, shopifyClientConfig, shopifyStorefrontApiClient } from '@/environment';
import { AppError } from '@/lib';

// https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate
const CART_CREATE = gql(`
	mutation cartCreate($input: CartInput!) {
		cartCreate(input: $input) {
			cart {
				id
				checkoutUrl
				totalQuantity
				cost {
					subtotalAmount {
						amount
						currencyCode
					}
					totalAmount {
						amount
						currencyCode
					}
					totalTaxAmount {
						amount
						currencyCode
					}
				}
				lines(first: 50) {
					edges {
						node {
							id
							quantity
							attributes {
								key
								value
							}
							merchandise {
								... on ProductVariant {
									id
									title
									price {
										amount
										currencyCode
									}
									image {
										url
										altText
									}
									product {
										id
										title
										handle
									}
								}
							}
						}
					}
				}
				attributes {
					key
					value
				}
			}
			userErrors {
				code
				message
			}
		}
	}
`);

export async function createCart(
	input: TCartCreateInput,
	config: TCreateCartConfig
): Promise<TResult<TCartCreateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyStorefrontApiClient.query(CART_CREATE, {
		prefixUrl: shopifyClientConfig.shop.storefrontApi(shopId),
		variables: { input },
		headers: {
			'X-Shopify-Storefront-Access-Token': accessToken
		}
	});
	if (result.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', {
				detail: `Shopify API request failed: ${result.error.message}`
			})
		);
	}

	const cartCreate = result.value.data?.cartCreate;
	if (cartCreate == null) {
		return Err(new AppError('#ERR_NO_CART_CREATED', { detail: 'No cart was created in Shopify' }));
	}

	const { cart, userErrors } = cartCreate;
	if (userErrors?.length > 0) {
		return Err(
			new AppError('#ERR_USER_ERROR', { detail: userErrors.map((e) => e.message).join(', ') })
		);
	}
	if (cart == null) {
		return Err(new AppError('#ERR_NO_CART_CREATED', { detail: 'No cart was created in Shopify' }));
	}

	return Ok({
		id: cart.id,
		checkoutUrl: cart.checkoutUrl,
		totalQuantity: cart.totalQuantity,
		cost: cart.cost,
		lines: cart.lines.edges.map((edge) => {
			const node = edge.node;
			return {
				id: node.id,
				quantity: node.quantity,
				attributes: node.attributes,
				merchandise: node.merchandise && {
					id: node.merchandise.id,
					title: node.merchandise.title,
					price: node.merchandise.price,
					image: node.merchandise.image,
					product: node.merchandise.product && {
						id: node.merchandise.product.id,
						title: node.merchandise.product.title,
						handle: node.merchandise.product.handle
					}
				}
			};
		}),
		attributes: cart.attributes
	});
}

interface TCreateCartConfig {
	shopId: string;
	accessToken: string;
}

export type TCartCreateInput = {
	lines?: { merchandiseId: string; quantity: number }[];
	attributes?: { key: string; value: string }[];
	buyerIdentity?: { countryCode?: TCountryCode };
	note?: string;
	discountCodes?: string[];
};

export type TCartCreateSuccess = {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	cost: {
		subtotalAmount: { amount: string; currencyCode: string };
		totalAmount: { amount: string; currencyCode: string };
		totalTaxAmount: { amount: string; currencyCode: string } | null;
	};
	lines: {
		id: string;
		quantity: number;
		attributes: { key: string; value: string | null }[];
		merchandise: {
			id: string;
			title: string;
			price: { amount: string; currencyCode: string };
			image: { url: string; altText: string | null } | null;
			product?: { id: string; title: string; handle: string };
		} | null;
	}[];
	attributes: { key: string; value: string | null }[];
};

export type TCartCreateError = {
	code: string;
	message: string;
};

export type TCountryCode =
	| 'AT'
	| 'DE'
	| 'US'
	| 'GB'
	| 'CA'
	| 'FR'
	| 'IT'
	| 'ES'
	| 'NL'
	| 'BE'
	| 'CH'
	| 'AU'
	| 'ZZ';

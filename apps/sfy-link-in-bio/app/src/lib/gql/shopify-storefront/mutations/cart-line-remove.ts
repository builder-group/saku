import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyClientConfig, shopifyStorefrontApiClient } from '@/environment';
import { AppError } from '@/lib';

// https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesRemove
const CART_LINE_REMOVE = gql(`
	mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
		cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

export async function removeCartLines(
	input: TCartLineRemoveInput,
	config: TRemoveCartLinesConfig
): Promise<TResult<TCartLineRemoveSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyStorefrontApiClient.query(CART_LINE_REMOVE, {
		variables: input,
		prefixUrl: shopifyClientConfig.shop.storefrontApi(shopId),
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

	const cartLinesRemove = result.value.data?.cartLinesRemove;
	if (cartLinesRemove == null) {
		return Err(
			new AppError('#ERR_NO_CART_LINES_REMOVED', {
				detail: 'No cart lines were removed from the cart'
			})
		);
	}

	const { cart, userErrors } = cartLinesRemove;
	if (userErrors?.length > 0) {
		return Err(
			new AppError('#ERR_USER_ERROR', { detail: userErrors.map((e) => e.message).join(', ') })
		);
	}
	if (cart == null) {
		return Err(
			new AppError('#ERR_NO_CART_LINES_REMOVED', {
				detail: 'No cart lines were removed from the cart'
			})
		);
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
				merchandise:
					node.merchandise != null
						? {
								id: node.merchandise.id,
								title: node.merchandise.title,
								price: node.merchandise.price,
								image: node.merchandise.image,
								product:
									node.merchandise.product != null
										? {
												id: node.merchandise.product.id,
												title: node.merchandise.product.title,
												handle: node.merchandise.product.handle
											}
										: undefined
							}
						: null
			};
		}),
		attributes: cart.attributes
	});
}

interface TRemoveCartLinesConfig {
	shopId: string;
	accessToken: string;
}

export interface TCartLineRemoveInput {
	cartId: string;
	lineIds: string[];
}

export interface TCartLineRemoveSuccess {
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
}

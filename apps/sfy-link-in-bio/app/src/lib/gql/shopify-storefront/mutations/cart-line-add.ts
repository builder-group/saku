import { Err, Ok, type TResult } from '@blgc/utils';
import { gql, shopifyStorefrontApiClient } from '@/environment';

// https://shopify.dev/docs/api/storefront/latest/mutations/cartlinesadd
const CART_LINE_ADD = gql(`
	mutation cartLineAdd($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
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

export async function addCartLines(
	input: TCartLineAddInput
): Promise<TResult<TCartLineAddSuccess, TCartLineAddError>> {
	const result = await shopifyStorefrontApiClient.query(CART_LINE_ADD, {
		variables: input
	});
	if (result.isErr()) {
		return Err({
			code: '#ERR_SHOPIFY_API_ERROR',
			message: `Shopify API request failed: ${result.error.message}`
		});
	}

	const cartLinesAdd = result.value.data?.cartLinesAdd;
	if (cartLinesAdd == null) {
		return Err({
			code: '#ERR_NO_CART_LINES_ADDED',
			message: 'No cart lines were added to the cart'
		});
	}

	const { cart, userErrors } = cartLinesAdd;
	if (userErrors?.length > 0) {
		return Err({
			code: '#ERR_USER_ERROR',
			message: userErrors.map((e) => e.message).join(', ')
		});
	}
	if (cart == null) {
		return Err({
			code: '#ERR_NO_CART_LINES_ADDED',
			message: 'No cart lines were added to the cart'
		});
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

export type TCartLineAddInput = {
	cartId: string;
	lines: { merchandiseId: string; quantity: number }[];
};

export type TCartLineAddSuccess = {
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

export type TCartLineAddError = {
	code: string;
	message: string;
};

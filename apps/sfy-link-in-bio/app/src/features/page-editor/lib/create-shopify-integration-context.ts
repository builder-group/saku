import { Err, Ok, withNew, type TResult } from '@blgc/utils';
import { createState, TState } from 'feature-state';
import { logger } from '@/environment';
import {
	addCartLines,
	AppError,
	createCart,
	removeCartLines,
	type TCartCreateInput,
	type TCartCreateSuccess,
	type TCartLineAddInput,
	type TCartLineAddSuccess,
	type TCartLineRemoveInput,
	type TCartLineRemoveSuccess
} from '@/lib';

export function createShopifyIntegrationContext(
	config: TCreateShopifyIntegrationContextConfig
): TShopifyIntegrationContext {
	const { shopId, storefrontAccessToken } = config;
	logger.info('createShopifyIntegrationContext', { config });

	return withNew<TShopifyIntegrationContext>({
		shopId,
		storefrontAccessToken,
		cart: createState<TCart | null>(null),

		_new() {
			// Auto-create cart on context initialization
			this.createCart().then((result) => {
				if (result.isOk()) {
					this.cart.set(result.value);
				}
			});
		},

		async createCart(input = {}) {
			const result = await createCart(input, {
				shopId: this.shopId,
				accessToken: this.storefrontAccessToken
			});

			if (result.isOk()) {
				this.cart.set(result.value);
			}

			return result;
		},

		async addToCart(lines) {
			// Try to create cart if it doesn't exist yet
			if (this.cart._v == null) {
				const cartResult = await this.createCart();
				if (cartResult.isErr()) {
					return cartResult;
				}
				if (this.cart._v == null) {
					return Err(new AppError('#ERR_NO_CART_AVAILABLE', { detail: 'No cart available' }));
				}
			}

			const result = await addCartLines(
				{ cartId: this.cart._v.id, lines },
				{
					shopId: this.shopId,
					accessToken: this.storefrontAccessToken
				}
			);

			if (result.isOk()) {
				this.cart.set(result.value);
			}

			return result;
		},

		async removeFromCart(lineIds) {
			if (this.cart._v == null) {
				return Err(new AppError('#ERR_NO_CART_AVAILABLE', { detail: 'No cart available' }));
			}

			const result = await removeCartLines(
				{ cartId: this.cart._v.id, lineIds },
				{
					shopId: this.shopId,
					accessToken: this.storefrontAccessToken
				}
			);
			if (result.isOk()) {
				this.cart.set(result.value);
			}

			return result;
		},

		async buyNow(lines) {
			// Create a fresh cart with the product (bypasses cached cart)
			const result = await createCart(
				{ lines },
				{
					shopId: this.shopId,
					accessToken: this.storefrontAccessToken
				}
			);
			if (result.isErr()) {
				return result;
			}

			return Ok({ checkoutUrl: result.value.checkoutUrl });
		},

		async checkout() {
			if (this.cart._v == null) {
				return Err(new AppError('#ERR_NO_CART_AVAILABLE', { detail: 'No cart available' }));
			}

			return Ok({ checkoutUrl: this.cart._v.checkoutUrl });
		}
	});
}

export type TCreateShopifyIntegrationContextConfig = {
	shopId: string;
	storefrontAccessToken: string;
};

export interface TShopifyIntegrationContext {
	shopId: string;
	storefrontAccessToken: string;
	cart: TState<TCart | null, []>;

	createCart(input?: TCartCreateInput): Promise<TResult<TCartCreateSuccess, AppError>>;
	addToCart(lines: TCartLineAddInput['lines']): Promise<TResult<TCartLineAddSuccess, AppError>>;
	removeFromCart(
		lineIds: TCartLineRemoveInput['lineIds']
	): Promise<TResult<TCartLineRemoveSuccess, AppError>>;
	buyNow(lines: TCartLineAddInput['lines']): Promise<TResult<{ checkoutUrl: string }, AppError>>;
	checkout(): Promise<TResult<{ checkoutUrl: string }, AppError>>;
}

interface TCart {
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

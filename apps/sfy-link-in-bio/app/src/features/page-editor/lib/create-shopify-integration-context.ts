import { Err, Ok, withNew, type TResult } from '@blgc/utils';
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
		cartId: null,

		_new() {
			// Auto-create cart on context initialization
			this.createCart().then((result) => {
				if (result.isOk()) {
					this.cartId = result.value.id;
				}
			});
		},

		async createCart(input = {}) {
			const result = await createCart(input, {
				shopId: this.shopId,
				accessToken: this.storefrontAccessToken
			});
			if (result.isOk()) {
				this.cartId = result.value.id;
			}

			return result;
		},

		async addToCart(lines) {
			// Try to create cart if it doesn't exist yet
			if (this.cartId == null) {
				const cartResult = await this.createCart({});
				if (cartResult.isErr()) {
					return cartResult;
				}
			}

			return addCartLines(
				{ cartId: this.cartId as string, lines },
				{
					shopId: this.shopId,
					accessToken: this.storefrontAccessToken
				}
			);
		},

		async removeFromCart(lineIds) {
			if (this.cartId == null) {
				return Err(new AppError('#ERR_NO_CART_AVAILABLE', { detail: 'No cart available' }));
			}

			return removeCartLines(
				{ cartId: this.cartId, lineIds },
				{
					shopId: this.shopId,
					accessToken: this.storefrontAccessToken
				}
			);
		},

		async checkout() {
			if (this.cartId == null) {
				return Err(new AppError('#ERR_NO_CART_AVAILABLE', { detail: 'No cart available' }));
			}

			// TODO:
			return Ok({ checkoutUrl: 'todo' });
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
	cartId: string | null;

	createCart(input?: TCartCreateInput): Promise<TResult<TCartCreateSuccess, AppError>>;
	addToCart(lines: TCartLineAddInput['lines']): Promise<TResult<TCartLineAddSuccess, AppError>>;
	removeFromCart(
		lineIds: TCartLineRemoveInput['lineIds']
	): Promise<TResult<TCartLineRemoveSuccess, AppError>>;
	checkout(): Promise<TResult<{ checkoutUrl: string }, AppError>>;
}

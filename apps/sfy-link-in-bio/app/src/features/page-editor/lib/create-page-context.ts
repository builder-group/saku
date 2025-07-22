import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError, createCart } from '@/lib';

export async function createPageContext(
	config: TCreatePageContextConfig
): Promise<TResult<TPageContext, AppError>> {
	const cartResult = await createCart({});
	if (cartResult.isErr()) {
		return Err(cartResult.error);
	}
	const cart = cartResult.value;

	return Ok({
		cartId: cart.id,
		siteId: config.siteId,
		storefrontAccessToken: config.storefrontAccessToken
	});
}

export type TCreatePageContextConfig = {
	siteId: string;
	storefrontAccessToken: string;
};

export type TPageContextError = {
	code: string;
	message: string;
};

export interface TPageContext {
	cartId: string;
	siteId: string;
	storefrontAccessToken: string;
}

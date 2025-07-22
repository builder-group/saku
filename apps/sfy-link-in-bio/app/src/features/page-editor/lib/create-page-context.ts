import { withNew } from '@blgc/utils';
import { createCart } from '@/lib';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { siteId, storefrontAccessToken } = config;

	return withNew({
		siteId,
		storefrontAccessToken,
		_new(this) {
			createCart({}).then((cartResult) => {
				if (cartResult.isOk()) {
					this.cartId = cartResult.value.id;
				}
			});
		}
	});
}

export type TCreatePageContextConfig = {
	siteId: string;
	storefrontAccessToken?: string;
};

export interface TPageContext {
	cartId?: string;
	siteId: string;
	storefrontAccessToken?: string;
}

import { withNew } from '@blgc/utils';
import { logger } from '@/environment';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { shopId, siteId, storefrontAccessToken } = config;
	logger.info('createPageContext', { config });

	return withNew({
		shopId,
		siteId,
		storefrontAccessToken,
		_new(this) {
			if (this.storefrontAccessToken != null) {
				// createCart({}, { shopId, accessToken: this.storefrontAccessToken }).then((cartResult) => {
				// 	if (cartResult.isOk()) {
				// 		this.cartId = cartResult.value.id;
				// 	}
				// });
			}
		}
	});
}

export type TCreatePageContextConfig = {
	shopId: string;
	siteId: string;
	storefrontAccessToken?: string;
};

export interface TPageContext {
	cartId?: string;
	shopId: string;
	siteId: string;
	storefrontAccessToken?: string;
}

import { withNew } from '@blgc/utils';
import { TIntegration } from '@repo/editor';
import { logger } from '@/environment';
import { createCart } from '../../../lib';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { siteId, integrations } = config;
	logger.info('createPageContext', { config });

	// Find first Shopify integration
	const shopifyIntegration = integrations.find((integration) => integration.type === 'shopify');

	return withNew({
		siteId,
		integrations: {
			shopify: shopifyIntegration
				? {
						shopId: shopifyIntegration.shopId,
						storefrontAccessToken: shopifyIntegration.storefrontAccessToken
					}
				: undefined
		},
		_new(this: TPageContext) {
			const shopifyIntegration = this.integrations.shopify;
			if (shopifyIntegration != null) {
				createCart(
					{},
					{
						shopId: shopifyIntegration.shopId,
						accessToken: shopifyIntegration.storefrontAccessToken
					}
				).then((cartResult) => {
					if (cartResult.isOk()) {
						shopifyIntegration.cartId = cartResult.value.id;
					}
				});
			}
		}
	});
}

export type TCreatePageContextConfig = {
	siteId: string;
	integrations: TIntegration[];
};

export interface TPageContext {
	siteId: string;
	integrations: {
		shopify?: {
			shopId: string;
			storefrontAccessToken: string;
			cartId?: string;
		};
	};
}

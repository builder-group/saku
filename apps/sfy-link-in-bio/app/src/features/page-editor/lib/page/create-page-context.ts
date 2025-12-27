import { TIntegration, TSiteUrl } from '@repo/editor';
import { logger } from '@/environment';
import { createShopifyIntegrationContext, type TShopifyIntegrationContext } from '../integration';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { id, url, integrations } = config;
	logger.info('createPageContext', { config });

	// Create Shopify integration context
	let shopifyIntegrationContext: TShopifyIntegrationContext | undefined;
	const shopifyIntegration = integrations.find((integration) => integration.type === 'shopify');
	if (shopifyIntegration != null) {
		shopifyIntegrationContext = createShopifyIntegrationContext({
			shopId: shopifyIntegration.shopId,
			storefrontAccessToken: shopifyIntegration.storefrontAccessToken
		});
	}

	return {
		id,
		url,
		integrations: {
			shopify: shopifyIntegrationContext
		}
	};
}

export type TCreatePageContextConfig = {
	id: string;
	url: TSiteUrl;
	integrations: TIntegration[];
};

export interface TPageContext {
	id: string;
	url: TSiteUrl;
	integrations: {
		shopify?: TShopifyIntegrationContext;
	};
}

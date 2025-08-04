import { TIntegration } from '@repo/editor';
import { logger } from '@/environment';
import {
	createShopifyIntegrationContext,
	type TShopifyIntegrationContext
} from '../integration/create-shopify-integration-context';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { siteId, integrations } = config;
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
		siteId,
		integrations: {
			shopify: shopifyIntegrationContext
		}
	};
}

export type TCreatePageContextConfig = {
	siteId: string;
	integrations: TIntegration[];
};

export interface TPageContext {
	siteId: string;
	integrations: {
		shopify?: TShopifyIntegrationContext;
	};
}

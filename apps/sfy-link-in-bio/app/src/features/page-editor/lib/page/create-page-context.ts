import { TGa4Integration, TIntegration, TMetaPixelIntegration, TSiteUrl } from '@repo/editor';
import { logger } from '@/environment';
import {
	createShopifyIntegrationContext,
	createTrackingContext,
	type TShopifyIntegrationContext,
	type TTrackingContext
} from '../integration';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { id, handle, url, integrations, trackingEnabled = false } = config;
	logger.info('createPageContext', { config });

	let shopifyIntegrationContext: TShopifyIntegrationContext | undefined;
	const shopifyIntegration = integrations.find((integration) => integration.type === 'shopify');
	if (shopifyIntegration != null) {
		shopifyIntegrationContext = createShopifyIntegrationContext({
			shopId: shopifyIntegration.shopId,
			storefrontAccessToken: shopifyIntegration.storefrontAccessToken
		});
	}

	const ga4Integration = integrations.find(
		(integration): integration is TGa4Integration => integration.type === 'ga4'
	);
	const metaPixelIntegration = integrations.find(
		(integration): integration is TMetaPixelIntegration => integration.type === 'meta-pixel'
	);
	const trackingIntegrationContext = createTrackingContext({
		ga4MeasurementId: ga4Integration?.measurementId,
		metaPixelId: metaPixelIntegration?.pixelId,
		enabled: trackingEnabled
	});

	return {
		id,
		handle,
		url,
		integrations: {
			shopify: shopifyIntegrationContext,
			tracking: trackingIntegrationContext
		}
	};
}

export type TCreatePageContextConfig = {
	id: string;
	handle: string;
	url: TSiteUrl;
	integrations: TIntegration[];
	trackingEnabled?: boolean;
};

export interface TPageContext {
	id: string;
	handle: string;
	url: TSiteUrl;
	integrations: {
		shopify?: TShopifyIntegrationContext;
		tracking: TTrackingContext;
	};
}

import { TGa4Integration, TIntegration, TMetaPixelIntegration, TSiteUrl } from '@repo/editor';
import { logger } from '@/environment';
import { createShopifyIntegrationContext, type TShopifyIntegrationContext } from '../integration';

export function createPageContext(config: TCreatePageContextConfig): TPageContext {
	const { id, handle, url, integrations, trackingEnabled = false } = config;
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

	const ga4Integration = integrations.find(
		(integration): integration is TGa4Integration => integration.type === 'ga4'
	);
	const metaPixelIntegration = integrations.find(
		(integration): integration is TMetaPixelIntegration => integration.type === 'meta-pixel'
	);

	return {
		id,
		handle,
		url,
		integrations: {
			shopify: shopifyIntegrationContext,
			ga4: ga4Integration,
			metaPixel: metaPixelIntegration
		},
		tracking: {
			enabled: trackingEnabled
		},
		trackEvent(event) {
			if (!this.tracking.enabled || typeof window === 'undefined') {
				return;
			}

			window.dispatchEvent(
				new CustomEvent<TPageTrackingEvent>('saku:track', {
					detail: event
				})
			);
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
		ga4?: TGa4Integration;
		metaPixel?: TMetaPixelIntegration;
	};
	tracking: {
		enabled: boolean;
	};
	trackEvent: (event: TPageTrackingEvent) => void;
}

export interface TPageTrackingEvent {
	name: 'outbound_link_click' | 'product_cta_click';
	properties: Record<string, string | number | boolean | undefined>;
}

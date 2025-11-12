import { type coreApiV1 } from '@repo/types/api';
import { createFetchClient, createOpenApiFetchClient, withGraphQL } from 'feature-fetch';
import { localNetworkAccessMiddleware } from '@/lib/http/local-network-access-middleware'; // Direct import to avoid circular dependency

import { apiClientConfig, appConfig } from '../configs';

export const coreApiClient = createOpenApiFetchClient<coreApiV1.paths>({
	prefixUrl: apiClientConfig.core.url,
	requestMiddlewares:
		appConfig.env === 'local' || appConfig.env === 'development'
			? [localNetworkAccessMiddleware]
			: []
});

export const shopifyStorefrontApiClient = withGraphQL(
	createFetchClient({
		prefixUrl: '' // Prefix URL is defined per request (https://shopify.dev/docs/api/storefront/latest)
	})
);

import { type coreApiV1 } from '@repo/types/api';
import { createFetchClient, createOpenApiFetchClient, withGraphQL } from 'feature-fetch';
import { apiClientConfig } from '../configs';

export const coreApiClient = createOpenApiFetchClient<coreApiV1.paths>({
	prefixUrl: apiClientConfig.core.url
});

export const shopifyStorefrontApiClient = withGraphQL(
	createFetchClient({
		prefixUrl: '' // Prefix URL is defined per request (https://shopify.dev/docs/api/storefront/latest)
	})
);

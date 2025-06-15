import { createFetchClient, withGraphQL } from 'feature-fetch';

export const shopifyAdminApiClient = withGraphQL(
	createFetchClient({
		prefixUrl: '' // Prefix URL is defined per request (https://shopify.dev/docs/api/admin-graphql)
	})
);

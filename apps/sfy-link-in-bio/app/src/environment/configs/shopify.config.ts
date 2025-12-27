import { ApiVersion } from '@shopify/shopify-api';
import { createHandleFromShop } from '@/lib/shopify/create-handle-from-shop'; // Direct import to avoid circular dependency like @/lib → gql → @/environment

import { appConfig } from './app.config';

const appProxyPath = appConfig.env === 'production' ? '/a/saku' : '/a/saku-local';

const apiVersion = ApiVersion.July25;
const appHandle = appConfig.env === 'production' ? 'saku-link-in-bio' : 'saku-link-in-bio-local';

export const shopifyClientConfig = {
	appHandle,
	shop: {
		storefrontApi: (shopId: string) => `https://${shopId}/api/${apiVersion}/graphql.json`,
		adminUrl: (shopId: string) =>
			`https://admin.shopify.com/store/${createHandleFromShop(shopId)}/apps/${appHandle}/app`,
		proxy: {
			path: appProxyPath,
			url: (shop: string) => `https://${shop}${appProxyPath}`
		},
		url: (shop: string) => `https://${shop}`
	},
	review: {
		cooldownDays: 60,
		maxRequestsPerYear: 3,
		localStorageKey: appConfig.localStorageKey('review-requests')
	}
};

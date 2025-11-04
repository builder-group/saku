import {
	ApiVersion,
	AppDistribution,
	shopifyApp as createShopifyApp
} from '@shopify/shopify-app-react-router/server';
import { ApiSessionStorage } from '@/.server/lib';
import { shopifyConfig } from './configs';

const shopifyApp: ReturnType<typeof createShopifyApp> = createShopifyApp({
	apiKey: shopifyConfig.apiKey,
	apiSecretKey: shopifyConfig.apiSecret,
	apiVersion: shopifyConfig.apiVersion,
	scopes: shopifyConfig.scopes,
	appUrl: shopifyConfig.appUrl,
	authPathPrefix: '/auth',
	sessionStorage: new ApiSessionStorage(),
	distribution: AppDistribution.AppStore,
	useOnlineTokens: true,
	future: {
		unstable_newEmbeddedAuthStrategy: true,
		removeRest: true
	},
	hooks: {
		afterAuth: async ({ session }) => {
			shopifyApp.registerWebhooks({ session });
			// logger.info('After auth hook called', { session });
		}
	},
	...(shopifyConfig.shopCustomDomain != null
		? { customShopDomains: [shopifyConfig.shopCustomDomain] }
		: {})
});

export const shopify: typeof shopifyApp & { apiVersion: ApiVersion } = Object.assign(shopifyApp, {
	apiVersion: shopifyConfig.apiVersion
});

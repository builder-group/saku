import { ApiSessionStorage } from '@/lib/.server';
import '@shopify/shopify-app-remix/adapters/node';
import {
	ApiVersion,
	AppDistribution,
	shopifyApp as createShopifyApp
} from '@shopify/shopify-app-remix/server';
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
	...(shopifyConfig.shopCustomDomain != null
		? { customShopDomains: [shopifyConfig.shopCustomDomain] }
		: {})
});

export const shopify: typeof shopifyApp & { apiVersion: ApiVersion } = Object.assign(shopifyApp, {
	apiVersion: shopifyConfig.apiVersion
});

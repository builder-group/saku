import '@shopify/shopify-app-remix/adapters/node';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';
import { shopifyConfig } from './environment';

export const shopifySessionStorage = new MemorySessionStorage();

const shopify = shopifyApp({
	apiKey: shopifyConfig.apiKey,
	apiSecretKey: shopifyConfig.apiSecret,
	apiVersion: ApiVersion.January25,
	scopes: shopifyConfig.scopes,
	appUrl: shopifyConfig.appUrl,
	authPathPrefix: '/auth',
	sessionStorage: shopifySessionStorage,
	distribution: AppDistribution.AppStore,
	future: {
		unstable_newEmbeddedAuthStrategy: true,
		removeRest: true
	},
	...(shopifyConfig.shopCustomDomain != null
		? { customShopDomains: [shopifyConfig.shopCustomDomain] }
		: {})
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate: typeof shopify.authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

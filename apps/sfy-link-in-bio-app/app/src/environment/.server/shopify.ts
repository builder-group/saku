import '@shopify/shopify-app-remix/adapters/node';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';
import { shopifyConfig } from './configs';

const shopifySessionStorage = new MemorySessionStorage();

export const shopify = Object.assign(
	shopifyApp({
		apiKey: shopifyConfig.apiKey,
		apiSecretKey: shopifyConfig.apiSecret,
		apiVersion: ApiVersion.January25,
		scopes: shopifyConfig.scopes,
		appUrl: shopifyConfig.appUrl,
		authPathPrefix: '/auth',
		sessionStorage: shopifySessionStorage,
		distribution: AppDistribution.AppStore,
		useOnlineTokens: true,
		future: {
			unstable_newEmbeddedAuthStrategy: true,
			removeRest: true
		},
		...(shopifyConfig.shopCustomDomain != null
			? { customShopDomains: [shopifyConfig.shopCustomDomain] }
			: {})
	}),
	{
		apiVersion: ApiVersion.January25
	}
);

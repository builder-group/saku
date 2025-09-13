import { ApiVersion } from '@shopify/shopify-api';
import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';
import { appConfig } from './app.config';

const appProxyPath = appConfig.env === 'production' ? '/a/saku' : '/a/saku-local';
const apiVersion = ApiVersion.July25;

export const shopifyConfig = {
	apiVersion,
	apiKey: validateEnvVar({
		envKey: 'SHOPIFY_API_KEY',
		validator: vValidator(v.string())
	}),
	apiSecret: validateEnvVar({
		envKey: 'SHOPIFY_API_SECRET',
		validator: vValidator(v.string())
	}),
	shop: {
		adminApi: (shopId: string) => `https://${shopId}/admin/api/${apiVersion}/graphql.json`
	},
	proxy: {
		path: appProxyPath,
		url: (shop: string) => `https://${shop}${appProxyPath}`
	},
	// https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect
	reservedPaths: [
		'/apps',
		'/application',
		'/cart',
		'/carts',
		'/orders',
		'/services',
		'/shop',
		'/products',
		'/collections'
	],
	appHandle: appConfig.env === 'production' ? 'saku-link-in-bio' : 'saku-link-in-bio-local'
};

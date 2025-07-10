import { ApiVersion } from '@shopify/shopify-app-remix/server';
import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';
import { appConfig } from '../../configs';

const appProxyPath = appConfig.env === 'production' ? '/a/saku' : '/a/saku-local';

export const shopifyConfig = {
	apiVersion: ApiVersion.July25,
	apiKey: validateEnvVar({
		envKey: 'SHOPIFY_API_KEY',
		validator: vValidator(v.string()),
		description: 'Shopify API key for app authentication',
		example: 'abc123xyz789'
	}),
	apiSecret: validateEnvVar({
		envKey: 'SHOPIFY_API_SECRET',
		validator: vValidator(v.string()),
		description: 'Shopify API secret key for app authentication',
		example: 'def456uvw012'
	}),
	appUrl: validateEnvVar({
		envKey: 'SHOPIFY_APP_URL',
		validator: vValidator(v.pipe(v.string(), v.url())),
		description: 'Public URL where the Shopify app is hosted',
		example: 'https://your-app.ngrok.io'
	}),
	scopes: validateEnvVar({
		envKey: 'SHOPIFY_SCOPES',
		validator: vValidator(v.string()),
		description: 'Comma-separated list of Shopify API scopes',
		example: 'read_products,write_products,read_orders'
	}).split(','),
	shopCustomDomain: validateEnvVar({
		envKey: 'SHOP_CUSTOM_DOMAIN',
		validator: vValidator(v.optional(v.string())),
		description: 'Optional custom domain for shop access',
		example: 'custom-shop.example.com'
	}),
	proxy: {
		path: appProxyPath,
		url: (shop: string) => `https://${shop}${appProxyPath}`
	},
	url: (shop: string) => `https://${shop}`
};

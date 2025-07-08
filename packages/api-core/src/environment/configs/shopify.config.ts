import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const shopifyConfig = {
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
	shop: {
		adminApi: (shopId: string) => `https://${shopId}/admin/api/2025-04/graphql.json`
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
	]
};

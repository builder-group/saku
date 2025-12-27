import { ApiVersion } from '@shopify/shopify-app-react-router/server';
import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const shopifyConfig = {
	apiVersion: ApiVersion.July25,
	apiKey: validateEnvVar({
		envKey: 'SHOPIFY_API_KEY',
		validator: vValidator(v.string())
	}),
	apiSecret: validateEnvVar({
		envKey: 'SHOPIFY_API_SECRET',
		validator: vValidator(v.string())
	}),
	appUrl: validateEnvVar({
		envKey: 'SHOPIFY_APP_URL',
		validator: vValidator(v.pipe(v.string(), v.url()))
	}),
	scopes: validateEnvVar({
		envKey: 'SHOPIFY_SCOPES',
		validator: vValidator(v.string())
	}).split(','),
	shopCustomDomain: validateEnvVar({
		envKey: 'SHOP_CUSTOM_DOMAIN',
		validator: vValidator(v.optional(v.string()))
	})
};

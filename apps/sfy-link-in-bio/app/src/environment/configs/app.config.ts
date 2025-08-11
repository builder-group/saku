import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

const env = validateEnvVar(
	{
		envKey: 'NODE_ENV',
		value: import.meta.env.MODE,
		validator: vValidator(v.picklist(['development', 'production', 'local', 'test'])),
		defaultValue: 'development' as const
	},
	{}
);

const packageVersion = validateEnvVar(
	{
		envKey: 'PACKAGE_VERSION',
		// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
		value: import.meta.env.PACKAGE_VERSION,
		validator: vValidator(v.string()),
		defaultValue: '0.0.0'
	},
	{}
);

export const appConfig = {
	env,
	packageVersion,
	version: `v${packageVersion}${env.slice(0, 1)}`,
	social: {
		discord: 'https://discord.com/invite/w4xE3bSjhQ'
	},
	distribution: {
		shopify: 'https://apps.shopify.com/saku-link-in-bio'
	},
	support: {
		email: 'support@saku.so'
	},
	legal: {
		privacy: `https://saku.so/legal/privacy`,
		terms: `https://saku.so/legal/terms`
	},
	featureFlags: {
		posthog: env === 'production',
		crisp: env === 'production'
	}
};

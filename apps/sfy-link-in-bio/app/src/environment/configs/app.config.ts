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
		shopify: 'https://apps.shopify.com/saku-bio-link'
	},
	help: {
		walkthroughVideo: 'https://youtu.be/5CUtoSWYQ7U'
	},
	support: {
		email: 'support@saku.so'
	},
	legal: {
		privacy: `https://sfy-link-in-bio-app.saku.so/legal/privacy-policy`,
		terms: `https://sfy-link-in-bio-app.saku.so/legal/terms-of-service`
	},
	featureFlags: {
		posthog: env === 'production',
		crisp: true,
		crispAutoResponse: true,
		mantle: true,
		requestReview: env === 'production'
	}
};

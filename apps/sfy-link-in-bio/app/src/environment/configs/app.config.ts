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

const platformBaseUrl = 'https://saku.so/w';

export const appConfig = {
	env,
	packageVersion,
	version: `v${packageVersion}${env.slice(0, 1)}`,
	localStorageKey: (key: string) => `sfy-saku-link-in-bio_${key}`,
	distribution: {
		shopify: 'https://apps.shopify.com/saku-bio-link'
	},
	help: {
		walkthroughVideo: 'https://youtu.be/5CUtoSWYQ7U',
		discord: 'https://discord.com/invite/w4xE3bSjhQ',
		email: 'support@saku.so',
		github: 'https://github.com/builder-group/saku',
		githubIssues: 'https://github.com/builder-group/saku/issues/new',
		legal: {
			privacy: `https://sfy-link-in-bio-app.saku.so/legal/privacy-policy`,
			terms: `https://sfy-link-in-bio-app.saku.so/legal/terms-of-service`
		}
	},
	featureFlags: {
		posthog: env === 'production',
		mantle: true,
		crisp: true,
		review: true
	},
	platformUrl: (workspaceHandle: string) => `${platformBaseUrl}/${workspaceHandle}`
};

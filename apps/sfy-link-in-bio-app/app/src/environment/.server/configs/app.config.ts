import * as v from 'valibot';
import { ciDefault, validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

const env = validateEnvVar({
	envKey: 'NODE_ENV',
	value: process.env['NODE_ENV'],
	validator: vValidator(v.picklist(['development', 'production', 'local', 'test'])),
	defaultValue: 'development' as const
});

const packageVersion = validateEnvVar({
	envKey: 'npm_package_version',
	value: process.env['npm_package_version'],
	validator: vValidator(v.string()),
	defaultValue: '0.0.0'
});

export const appConfig = {
	env,
	packageVersion,
	version: `v${packageVersion}${env.slice(0, 1)}`,
	secret: validateEnvVar({
		envKey: 'API_CORE_SECRET',
		validator: vValidator(v.string()),
		defaultValue: ciDefault('')
	}),
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
	}
};

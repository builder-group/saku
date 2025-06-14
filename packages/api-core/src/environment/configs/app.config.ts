import {
	ciDefault,
	combineDefaults,
	devDefault,
	nonEmptyStringMiddleware,
	portValidator,
	urlValidator,
	validateEnvVar
} from 'validatenv';
import { zValidator } from 'validation-adapters/zod';
import { z } from 'zod';

const env = validateEnvVar({
	envKey: 'NODE_ENV',
	validator: zValidator(z.enum(['development', 'production', 'local', 'test']))
});

const packageVersion = validateEnvVar({
	envKey: 'npm_package_version',
	// @ts-expect-error -- @rollup/plugin-replace
	value: process.env.npm_package_version,
	validator: zValidator(z.string()),
	defaultValue: '0.0.0'
});

const devPort = validateEnvVar({
	envKey: 'API_CORE_DEV_PORT',
	validator: portValidator,
	defaultValue: 8787
});

const url = validateEnvVar({
	envKey: 'API_CORE_URL',
	validator: urlValidator,
	middlewares: [
		nonEmptyStringMiddleware,
		(value) => (value?.endsWith('/') ? value.slice(0, -1) : value)
	],
	defaultValue: combineDefaults(
		devDefault(`http://127.0.0.1:${devPort}`),
		ciDefault('https://api.saku.so')
	)
});

export const appConfig = {
	env,
	packageVersion,
	version: `v${packageVersion}${env.slice(0, 1)}`,
	url,
	secret: validateEnvVar({
		envKey: 'API_CORE_SECRET',
		validator: zValidator(z.string()),
		defaultValue: ciDefault('')
	}),
	client: {
		appUrl: validateEnvVar({
			envKey: 'API_CORE_CLIENT_APP_URL',
			validator: urlValidator,
			middlewares: [
				nonEmptyStringMiddleware,
				(value) => (value?.endsWith('/') ? value.slice(0, -1) : value)
			],
			defaultValue: combineDefaults(
				devDefault('http://127.0.0.1:3000'),
				ciDefault('https://app.saku.so')
			)
		})
	},
	dev: {
		port: devPort
	}
};

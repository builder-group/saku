import {
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
	validator: zValidator(z.enum(['development', 'production', 'local', 'test'])),
	defaultValue: 'development' as const
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
	defaultValue: devDefault(`http://127.0.0.1:${devPort}`)
});

export const appConfig = {
	env,
	packageVersion,
	version: `v${packageVersion}${env.slice(0, 1)}`,
	url,
	secret: validateEnvVar({
		envKey: 'API_CORE_SECRET',
		validator: zValidator(z.string())
	}),
	accessSecret: validateEnvVar({
		envKey: 'API_CORE_ACCESS_SECRET',
		validator: zValidator(z.string())
	}),
	client: {
		appUrl: validateEnvVar({
			envKey: 'API_CORE_CLIENT_APP_URL',
			validator: urlValidator,
			middlewares: [
				nonEmptyStringMiddleware,
				(value) => (value?.endsWith('/') ? value.slice(0, -1) : value)
			]
		})
	},
	dev: {
		port: devPort
	}
};

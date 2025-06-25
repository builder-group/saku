import { getHostname } from '@blgc/utils';
import {
	ciDefault,
	combineDefaults,
	devDefault,
	nonEmptyStringMiddleware,
	urlValidator,
	validateEnvVar
} from 'validatenv';

const coreApiUrl = validateEnvVar(
	{
		envKey: 'VITE_CLIENT_API_CORE_URL',
		// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
		value: import.meta.env.VITE_CLIENT_API_CORE_URL,
		validator: urlValidator,
		middlewares: [
			nonEmptyStringMiddleware,
			(value) => (value?.endsWith('/') ? value.slice(0, -1) : value)
		],
		defaultValue: combineDefaults(
			devDefault('http://127.0.0.1:8787'),
			ciDefault('http://127.0.0.1:8787')
		)
	},
	{}
);

export const apiClientConfig = {
	core: {
		url: coreApiUrl,
		hostname: getHostname(coreApiUrl)
	}
};

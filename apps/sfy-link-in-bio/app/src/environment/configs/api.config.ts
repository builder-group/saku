import { getHostname } from '@blgc/utils';
import { nonEmptyStringMiddleware, urlValidator, validateEnvVar } from 'validatenv';

const coreApiUrl = validateEnvVar(
	{
		envKey: 'VITE_API_CORE_URL',
		// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
		value: import.meta.env.VITE_API_CORE_URL,
		validator: urlValidator,
		middlewares: [
			nonEmptyStringMiddleware,
			(value) => (value?.endsWith('/') ? value.slice(0, -1) : value)
		]
	},
	{}
);

export const apiClientConfig = {
	core: {
		url: coreApiUrl,
		hostname: getHostname(coreApiUrl)
	}
};

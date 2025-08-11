import { getHostname } from '@blgc/utils';
import * as v from 'valibot';
import { nonEmptyStringMiddleware, urlValidator, validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

const coreApiUrl = validateEnvVar({
	envKey: 'VITE_API_CORE_URL',
	validator: urlValidator,
	middlewares: [
		nonEmptyStringMiddleware,
		(value) => (value?.endsWith('/') ? value.slice(0, -1) : value)
	]
});

export const apiConfig = {
	core: {
		url: coreApiUrl,
		hostname: getHostname(coreApiUrl),
		accessSecret: validateEnvVar({
			envKey: 'CLIENT_API_CORE_ACCESS_SECRET',
			validator: vValidator(v.string())
		})
	}
};

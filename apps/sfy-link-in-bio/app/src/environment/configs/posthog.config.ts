import * as v from 'valibot';
import { urlValidator, validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const posthogConfig = {
	key: validateEnvVar(
		{
			envKey: 'VITE_POSTHOG_KEY',
			// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
			value: import.meta.env.VITE_POSTHOG_KEY,
			validator: vValidator(v.string())
		},
		{}
	),
	host: validateEnvVar(
		{
			envKey: 'VITE_POSTHOG_HOST',
			// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
			value: import.meta.env.VITE_POSTHOG_HOST,
			validator: urlValidator
		},
		{}
	)
};

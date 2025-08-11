import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const mantleConfig = {
	appId: validateEnvVar(
		{
			envKey: 'VITE_MANTLE_APP_ID',
			// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
			value: import.meta.env.VITE_MANTLE_APP_ID,
			validator: vValidator(v.string())
		},
		{}
	)
};

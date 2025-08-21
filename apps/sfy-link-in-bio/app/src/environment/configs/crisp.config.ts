import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const crispConfig = {
	websiteToken: validateEnvVar(
		{
			envKey: 'VITE_CRISP_TOKEN',
			// @ts-expect-error -- https://vite.dev/guide/env-and-mode#env-variables
			value: import.meta.env.VITE_CRISP_TOKEN,
			validator: vValidator(v.string())
		},
		{}
	),
	clientUrl: 'https://client.crisp.chat/l.js'
};

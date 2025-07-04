import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const appConfig = {
	env: validateEnvVar(
		{
			envKey: 'NODE_ENV',
			value: import.meta.env.MODE,
			validator: vValidator(v.picklist(['development', 'production', 'local', 'test'])),
			defaultValue: 'development' as const
		},
		{}
	)
};

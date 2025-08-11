import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const mantleConfig = {
	appId: validateEnvVar({
		envKey: 'MANTLE_APP_ID',
		validator: vValidator(v.string())
	}),
	apiKey: validateEnvVar({
		envKey: 'MANTLE_API_KEY',
		validator: vValidator(v.string())
	})
};

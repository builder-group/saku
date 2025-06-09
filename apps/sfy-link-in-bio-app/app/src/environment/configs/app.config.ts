import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';

export const appConfig = {
	env: validateEnvVar({
		envKey: 'NODE_ENV',
		value: process.env['NODE_ENV'],
		validator: vValidator(v.picklist(['development', 'production', 'local', 'test'])),
		defaultValue: 'development' as const
	}),
	packageVersion: validateEnvVar({
		envKey: 'npm_package_version',
		value: process.env['npm_package_version'],
		validator: vValidator(v.string()),
		defaultValue: '0.0.0'
	})
};

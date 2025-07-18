import { urlValidator, validateEnvVar } from 'validatenv';

export const dbConfig = {
	url: validateEnvVar({
		envKey: 'DB_URL',
		validator: urlValidator
	})
};

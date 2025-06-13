import { ciDefault, urlValidator, validateEnvVar } from 'validatenv';

export const dbConfig = {
	url: validateEnvVar({
		envKey: 'DB_URL',
		validator: urlValidator,
		example: 'postgresql://user:password@localhost:5432/dbname',
		defaultValue: ciDefault('postgresql://user:password@localhost:5432/dbname')
	})
};

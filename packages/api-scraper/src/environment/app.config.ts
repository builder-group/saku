import path from 'node:path';
import { config } from 'dotenv';

export const appConfig = (() => {
	config({ path: path.resolve(__dirname, '../../.env') });

	return {
		username: process.env['OXYLABS_USERNAME']!,
		password: process.env['OXYLABS_PASSWORD']!,
		endpoint: process.env['OXYLABS_ENDPOINT']!,
		env: process.env['NODE_ENV']!
	};
})();

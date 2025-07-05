import path from 'node:path';
import { config } from 'dotenv';

export const { appConfig } = await (async () => {
	// Load environment variables first
	config({ path: path.resolve(__dirname, '../../../.env') });

	// Import app config after environment is loaded
	const { appConfig } = await import('./app.config');

	return {
		appConfig
	};
})();

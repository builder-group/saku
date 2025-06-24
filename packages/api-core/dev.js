import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

// Load .env for app config
const nodeEnv = process.env['NODE_ENV'] ?? 'local';
dotenv.config({ path: `.env.${nodeEnv}` });
console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);

(async () => {
	const { createApp, apiCoreAppConfig } = await import('./src');

	const app = createApp();

	console.log(`Server is running at ${apiCoreAppConfig.url}`);

	serve({
		fetch: app.fetch,
		port: apiCoreAppConfig.dev.port
	});
})().catch((e) => {
	console.error('Failed to run server by exception: ', e);
});

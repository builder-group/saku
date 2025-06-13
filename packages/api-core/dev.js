import { serve } from '@hono/node-server';

(async () => {
	// Only load .env in development (for app config)
	const nodeEnv = process.env['NODE_ENV'] ?? 'local';
	if (nodeEnv === 'local') {
		const dotenv = await import('dotenv');
		dotenv.config({ path: `.env.${nodeEnv}` });
		console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);
	}

	const { createApp, apiCoreAppConfig } = await import('./src');

	const app = createApp();

	console.log(`Server is running at ${apiCoreAppConfig.url}`);

	serve({
		fetch: app.fetch,
		port: apiCoreAppConfig.dev.port
	});
})();

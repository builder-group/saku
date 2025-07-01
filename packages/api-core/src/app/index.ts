import { corsMiddleware, invalidPathHandler, TCorsOrigin } from '@repo/hono-utils';
import { Hono } from 'hono';
import { logger as loggerMiddleware } from 'hono/logger';
import { appConfig, logger } from '@/environment';
import { errorHandler } from './handlers';
import { router } from './router';
import './routes';

export function createApp(app: Hono = new Hono()): Hono {
	app.onError(errorHandler);
	app.notFound(invalidPathHandler);
	app.use(
		loggerMiddleware((str: string, ...rest: string[]) => {
			logger.info(str, rest);
		})
	);
	app.use(
		'*',
		corsMiddleware({
			origin: [
				appConfig.client.appUrl,
				{ strategy: 'tld', domain: 'myshopify.com' },
				...(appConfig.env === 'local' || appConfig.env === 'development'
					? ([{ strategy: 'tld', domain: 'trycloudflare.com' }] satisfies TCorsOrigin)
					: [])
			]
		})
	);

	app.route('/', router);

	return app;
}

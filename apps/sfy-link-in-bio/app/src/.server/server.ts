import { cors } from 'hono/cors';
import { logger as loggerMiddleware } from 'hono/logger';
import { createHonoServer } from 'react-router-hono-server/node';
import { logger } from '../environment';

export default await createHonoServer({
	beforeAll(app) {
		app.use(
			loggerMiddleware((str: string, ...rest: string[]) => {
				logger.info(str, rest);
			})
		);
		app.use(
			'/assets/*',
			cors({
				origin: '*',
				allowMethods: ['GET', 'HEAD', 'OPTIONS'],
				maxAge: 86400
			})
		);
	}
});

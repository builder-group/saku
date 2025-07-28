import { cors } from 'hono/cors';
import { createHonoServer } from 'react-router-hono-server/node';

export default await createHonoServer({
	beforeAll(app) {
		// Enable CORS for assets (JS, CSS, etc.) to support Shopify App Proxy.
		// When merchants access our app through their store (e.g. shop.myshopify.com or shop.com),
		// the requests originate from their domain but need to fetch assets from our domain.
		// We only allow CORS for assets as a security compromise - not for all routes.
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

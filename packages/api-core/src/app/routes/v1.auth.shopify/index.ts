import { router } from '@/app/router';
import {
	createShopifySession,
	deleteShopifySession,
	getShopifySession,
	getShopifySessionsByShop
} from './lib';
import {
	CreateSessionRoute,
	DeleteSessionRoute,
	GetSessionByShopRoute,
	GetSessionRoute
} from './schema';

// TODO: Verify shared app secret.. so that nb can create a session other than the backend for frontend..

router.openapi(CreateSessionRoute, async (c) => {
	const input = c.req.valid('json');
	await createShopifySession(input);
	return c.body(null, 204);
});

router.openapi(GetSessionRoute, async (c) => {
	const { sessionId } = c.req.valid('param');
	const session = await getShopifySession(sessionId);
	return c.json(session, 200);
});

router.openapi(DeleteSessionRoute, async (c) => {
	const { sessionId } = c.req.valid('param');
	await deleteShopifySession(sessionId);
	return c.body(null, 204);
});

router.openapi(GetSessionByShopRoute, async (c) => {
	const { shopId } = c.req.valid('param');
	const sessions = await getShopifySessionsByShop(shopId);
	return c.json(sessions, 200);
});

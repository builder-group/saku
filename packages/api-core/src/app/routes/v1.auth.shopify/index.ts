import { router } from '@/app/router';
import { appConfig } from '@/environment';
import { verifySharedSecret } from '@/lib';
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

router.openapi(CreateSessionRoute, async (c) => {
	const input = c.req.valid('json');
	await verifySharedSecret(c, appConfig.secret);
	await createShopifySession(input);
	return c.body(null, 204);
});

router.openapi(GetSessionRoute, async (c) => {
	const { sessionId } = c.req.valid('param');
	await verifySharedSecret(c, appConfig.secret);
	const session = await getShopifySession(sessionId);
	return c.json(session, 200);
});

router.openapi(DeleteSessionRoute, async (c) => {
	const { sessionId } = c.req.valid('param');
	await verifySharedSecret(c, appConfig.secret);
	await deleteShopifySession(sessionId);
	return c.body(null, 204);
});

router.openapi(GetSessionByShopRoute, async (c) => {
	const { shopId } = c.req.valid('param');
	await verifySharedSecret(c, appConfig.secret);
	const sessions = await getShopifySessionsByShop(shopId);
	return c.json(sessions, 200);
});

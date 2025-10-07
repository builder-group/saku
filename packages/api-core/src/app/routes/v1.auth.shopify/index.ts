import { router } from '@/app/router';
import { verifyAccessSecret } from '@/lib';
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
	(await verifyAccessSecret(c)).unwrap();
	const input = c.req.valid('json');

	await createShopifySession(input);

	return c.body(null, 204);
});

router.openapi(GetSessionRoute, async (c) => {
	(await verifyAccessSecret(c)).unwrap();
	const { sessionId } = c.req.valid('param');

	const session = await getShopifySession(sessionId);

	return c.json(session, 200);
});

router.openapi(DeleteSessionRoute, async (c) => {
	(await verifyAccessSecret(c)).unwrap();
	const { sessionId } = c.req.valid('param');

	await deleteShopifySession(sessionId);

	return c.json({ success: true }, 200);
});

router.openapi(GetSessionByShopRoute, async (c) => {
	(await verifyAccessSecret(c)).unwrap();
	const { shopId } = c.req.valid('param');

	const sessions = await getShopifySessionsByShop(shopId);

	return c.json(sessions, 200);
});

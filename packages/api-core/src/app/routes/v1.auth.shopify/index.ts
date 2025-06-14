import { AppError } from '@repo/hono-utils';
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

router.openapi(CreateSessionRoute, async (c) => {
	const input = c.req.valid('json');
	try {
		const session = await createShopifySession(input);
		return c.json(session, 201);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError('#ERR_SESSION_CREATE_FAILED', 500, {
			detail: 'Failed to create Shopify session'
		});
	}
});

router.openapi(GetSessionRoute, async (c) => {
	const { sessionId } = c.req.valid('param');
	try {
		const session = await getShopifySession(sessionId);
		return c.json(session, 200);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError('#ERR_INTERNAL_SERVER_ERROR', 500, {
			detail: 'Failed to get Shopify session'
		});
	}
});

router.openapi(DeleteSessionRoute, async (c) => {
	const { sessionId } = c.req.valid('param');
	try {
		await deleteShopifySession(sessionId);
		return c.body(null, 204);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError('#ERR_INTERNAL_SERVER_ERROR', 500, {
			detail: 'Failed to delete Shopify session'
		});
	}
});

router.openapi(GetSessionByShopRoute, async (c) => {
	const { shopId } = c.req.valid('param');
	try {
		const sessions = await getShopifySessionsByShop(shopId);
		return c.json(sessions, 200);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError('#ERR_INTERNAL_SERVER_ERROR', 500, {
			detail: 'Failed to get Shopify sessions by shop'
		});
	}
});

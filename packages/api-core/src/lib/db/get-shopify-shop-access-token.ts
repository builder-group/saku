import { AppError } from '@repo/hono-utils';
import { eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';

export async function getShopifyShopAccessToken(shopId: string): Promise<string> {
	// Get sessions for this shop
	const sessions = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopId));
	if (!sessions.length) {
		throw new AppError('#ERR_SHOP_NOT_FOUND', 404, {
			detail: `Shop not found: ${shopId}`
		});
	}

	// Prefer offline token (never expires) over online token (expires every 24h)
	const offlineSession = sessions.find((session) => !session.isOnline);
	if (offlineSession != null) {
		return offlineSession.accessToken;
	}

	// Fallback to online token if offline not available
	const onlineSession = sessions.find((session) => session.isOnline);
	if (onlineSession != null) {
		if (onlineSession.expiresAt && new Date() >= onlineSession.expiresAt) {
			throw new AppError('#ERR_ACCESS_TOKEN_EXPIRED', 401, {
				detail: `Online access token has expired for shop: ${shopId}. Token expired at: ${onlineSession.expiresAt.toISOString()}`
			});
		}

		return onlineSession.accessToken;
	}

	throw new AppError('#ERR_ACCESS_TOKEN_NOT_FOUND', 404, {
		detail: `No access token found for shop: ${shopId}`
	});
}

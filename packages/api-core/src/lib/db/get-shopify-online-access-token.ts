import { AppError } from '@repo/hono-utils';
import { and, desc, eq } from 'drizzle-orm';
import { Err, Ok, type TResult } from 'tuple-result';
import { db, shopifySessionTable } from '@/environment/db';

/**
 * Gets an online access token for a shop.
 * Online tokens are required for operations that need an active user session.
 * If userId is provided, returns the token for that specific user.
 */
export async function getShopifyOnlineAccessToken(
	shopId: string,
	options: TGetShopifyOnlineAccessTokenOptions = {}
): Promise<TResult<string, AppError>> {
	const { userId } = options;

	const [session] = await db
		.select()
		.from(shopifySessionTable)
		.where(
			and(
				eq(shopifySessionTable.shopId, shopId),
				eq(shopifySessionTable.isOnline, true),
				...(userId != null ? [eq(shopifySessionTable.sessionId, `${shopId}_${userId}`)] : [])
			)
		)
		.orderBy(desc(shopifySessionTable.expiresAt))
		.limit(1);
	if (session == null) {
		return Err(
			new AppError('#ERR_ACCESS_TOKEN_NOT_FOUND', 404, {
				detail:
					userId != null
						? `No online access token found for shop: ${shopId} and user: ${userId}`
						: `No online access token found for shop: ${shopId}`
			})
		);
	}

	if (session.expiresAt != null && new Date() >= session.expiresAt) {
		return Err(
			new AppError('#ERR_ACCESS_TOKEN_EXPIRED', 401, {
				detail:
					userId != null
						? `Online access token has expired for shop: ${shopId} and user: ${userId}. Token expired at: ${session.expiresAt.toISOString()}`
						: `Online access token has expired for shop: ${shopId}. Token expired at: ${session.expiresAt.toISOString()}`
			})
		);
	}

	return Ok(session.accessToken);
}

interface TGetShopifyOnlineAccessTokenOptions {
	/**
	 * If provided, returns the online token for this specific user.
	 * If not provided, returns any valid online token.
	 */
	userId?: number;
}

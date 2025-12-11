import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { Ok, type TResult } from 'tuple-result';
import { db, logger, redisClient, shopifySessionTable } from '@/environment';
import { getShopifyOnlineAccessToken } from './get-shopify-online-access-token';

/**
 * Gets the offline access token for a shop.
 * This is the default token used for most operations.
 * Offline tokens never expire and are always available.
 * Falls back to an online access token if no offline token is found.
 *
 * Note: The fallback prevents errors when offline token creation fails
 * (e.g. during network outages or initial app installation). Online tokens
 * are user-scoped and may expire, so this should only happen in edge cases.
 */
export async function getShopifyOfflineAccessToken(
	shopId: string
): Promise<TResult<string, AppError>> {
	const cached = await redisClient.getShopifyOfflineAccessToken(shopId);
	if (cached != null) {
		return Ok(cached);
	}

	// First, try to get offline token
	const [offlineSession] = await db
		.select()
		.from(shopifySessionTable)
		.where(and(eq(shopifySessionTable.shopId, shopId), eq(shopifySessionTable.isOnline, false)))
		.limit(1);
	if (offlineSession != null) {
		await redisClient.setShopifySession({
			id: offlineSession.sessionId,
			shop: offlineSession.shopId,
			state: offlineSession.state,
			isOnline: false,
			scope: offlineSession.scopes,
			expires: null,
			accessToken: offlineSession.accessToken,
			mantleApiToken: offlineSession.sessionData?.mantleApiToken ?? null,
			onlineAccessInfo: null
		});
		return Ok(offlineSession.accessToken);
	}

	// Fallback to online token if offline token is not found
	logger.warn('Offline access token not found, falling back to online token', {
		shopId
	});
	return getShopifyOnlineAccessToken(shopId);
}

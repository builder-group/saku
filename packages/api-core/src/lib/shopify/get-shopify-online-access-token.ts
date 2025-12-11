import { AppError } from '@repo/hono-utils';
import { and, desc, eq } from 'drizzle-orm';
import { Err, Ok, type TResult } from 'tuple-result';
import { db, redisClient, shopifySessionTable } from '@/environment';

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

	const cached = await redisClient.getShopifyOnlineAccessToken(shopId, userId);
	if (cached != null) {
		return Ok(cached.token);
	}

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

	await redisClient.setShopifySession({
		id: session.sessionId,
		shop: session.shopId,
		state: session.state,
		isOnline: true,
		scope: session.scopes,
		expires: session.expiresAt?.toISOString() ?? null,
		accessToken: session.accessToken,
		mantleApiToken: session.sessionData?.mantleApiToken ?? null,
		onlineAccessInfo:
			session.sessionData?.onlineAccessInfo != null
				? {
						associatedUser: {
							id: session.sessionData.onlineAccessInfo.associatedUser.id,
							firstName: session.sessionData.onlineAccessInfo.associatedUser.firstName,
							lastName: session.sessionData.onlineAccessInfo.associatedUser.lastName,
							email: session.sessionData.onlineAccessInfo.associatedUser.email,
							accountOwner: session.sessionData.onlineAccessInfo.associatedUser.accountOwner,
							locale: session.sessionData.onlineAccessInfo.associatedUser.locale,
							collaborator: session.sessionData.onlineAccessInfo.associatedUser.collaborator,
							emailVerified: session.sessionData.onlineAccessInfo.associatedUser.emailVerified
						},
						expiresIn: session.sessionData.onlineAccessInfo.expiresIn,
						associatedUserScope: session.sessionData.onlineAccessInfo.associatedUserScope,
						session: session.sessionData.onlineAccessInfo.session,
						accountNumber: session.sessionData.onlineAccessInfo.accountNumber
					}
				: null
	});

	return Ok(session.accessToken);
}

interface TGetShopifyOnlineAccessTokenOptions {
	/**
	 * If provided, returns the online token for this specific user.
	 * If not provided, returns any valid online token.
	 */
	userId?: string;
}

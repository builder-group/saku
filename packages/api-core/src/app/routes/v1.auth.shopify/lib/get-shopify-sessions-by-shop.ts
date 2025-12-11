import { eq } from 'drizzle-orm';
import { db, redisClient, shopifySessionTable } from '@/environment';
import type { TShopifySessionDto } from '../schema';
import { mapCachedToDto, mapDtoToCached } from './session-mapper';

export async function getShopifySessionsByShop(shopId: string): Promise<TShopifySessionDto[]> {
	const cached = await redisClient.getShopifySessionsByShop(shopId);
	if (cached != null) {
		return cached.map(mapCachedToDto);
	}

	const sessions = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopId));
	if (!sessions.length) {
		return [];
	}

	// Mantle token is stored in offline session, find it once for all online sessions
	const offlineSession = sessions.find((s) => !s.isOnline);
	const offlineMantleApiToken = offlineSession?.sessionData?.mantleApiToken ?? null;

	const sessionsDto = sessions.map((session) => {
		// Use offline session's mantleApiToken for online sessions
		const mantleApiToken =
			session.isOnline && session.sessionData?.mantleApiToken == null
				? offlineMantleApiToken
				: (session.sessionData?.mantleApiToken ?? null);

		return {
			id: session.sessionId,
			shop: session.shopId,
			state: session.state,
			isOnline: session.isOnline,
			scope: session.scopes,
			expires: session.expiresAt?.toISOString() ?? null,
			accessToken: session.accessToken,
			mantleApiToken,
			onlineAccessInfo:
				session.sessionData?.onlineAccessInfo != null
					? {
							associated_user: {
								id: session.sessionData.onlineAccessInfo.associatedUser.id,
								first_name: session.sessionData.onlineAccessInfo.associatedUser.firstName,
								last_name: session.sessionData.onlineAccessInfo.associatedUser.lastName,
								email: session.sessionData.onlineAccessInfo.associatedUser.email,
								account_owner: session.sessionData.onlineAccessInfo.associatedUser.accountOwner,
								locale: session.sessionData.onlineAccessInfo.associatedUser.locale,
								collaborator: session.sessionData.onlineAccessInfo.associatedUser.collaborator,
								email_verified: session.sessionData.onlineAccessInfo.associatedUser.emailVerified
							},
							expires_in: session.sessionData.onlineAccessInfo.expiresIn,
							associated_user_scope: session.sessionData.onlineAccessInfo.associatedUserScope,
							session: session.sessionData.onlineAccessInfo.session,
							account_number: session.sessionData.onlineAccessInfo.accountNumber
						}
					: null
		};
	});

	await redisClient.setShopifySessionsByShop(shopId, sessionsDto.map(mapDtoToCached));

	return sessionsDto;
}

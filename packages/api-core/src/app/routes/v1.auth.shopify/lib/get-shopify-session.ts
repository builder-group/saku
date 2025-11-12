import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';
import type { TShopifySessionDto } from '../schema';

export async function getShopifySession(sessionId: string): Promise<TShopifySessionDto> {
	const [session] = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.sessionId, sessionId))
		.limit(1);
	if (session == null) {
		throw new AppError('#ERR_SESSION_NOT_FOUND', 404, {
			detail: 'Shopify session not found'
		});
	}

	// Mantle token is stored in offline session, so fetch it for online sessions
	let mantleApiToken = session.sessionData?.mantleApiToken ?? null;
	if (session.isOnline && mantleApiToken == null) {
		const [offlineSession] = await db
			.select({
				sessionData: shopifySessionTable.sessionData
			})
			.from(shopifySessionTable)
			.where(
				and(eq(shopifySessionTable.shopId, session.shopId), eq(shopifySessionTable.isOnline, false))
			)
			.limit(1);
		mantleApiToken = offlineSession?.sessionData?.mantleApiToken ?? null;
	}

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
}

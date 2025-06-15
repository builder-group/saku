import { AppError } from '@repo/hono-utils';
import { eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';
import type { TShopifySessionDto } from '../schema';

export async function getShopifySession(sessionId: string): Promise<TShopifySessionDto> {
	// Get session
	const sessions = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.sessionId, sessionId))
		.limit(1);
	const session = sessions[0];
	if (session == null) {
		throw new AppError('#ERR_SESSION_NOT_FOUND', 404, {
			detail: 'Shopify session not found'
		});
	}

	// Build base session response
	const sessionDto: TShopifySessionDto = {
		id: session.sessionId,
		shop: session.shopId,
		state: session.state,
		isOnline: session.isOnline,
		scope: session.scopes,
		expires: session.expiresAt?.toISOString() ?? null,
		accessToken: session.accessToken,
		onlineAccessInfo: null
	};

	// Note: We don't populate onlineAccessInfo because it should represent the user who
	// created THIS specific session, not the current shop owner.
	// Since we don't store the original session creator info,
	// we leave this null to avoid data inconsistency.
	//
	// TODO: Consider storing original session creator in session table if onlineAccessInfo is needed
	//
	// if (session.isOnline) {
	// 	const shopAccounts = await db
	// 		.select({
	// 			providerData: shopAccountTable.providerData
	// 		})
	// 		.from(shopAccountTable)
	// 		.where(
	// 			and(
	// 				eq(shopAccountTable.provider, 'shopify'),
	// 				eq(shopAccountTable.providerAccountId, session.shopId)
	// 			)
	// 		)
	// 		.limit(1);
	// 	const lastInstaller = shopAccounts[0]?.providerData?.lastInstaller;

	// 	if (lastInstaller != null) {
	// 		sessionDto.onlineAccessInfo = {
	// 			associated_user: {
	// 				id: parseInt(lastInstaller.shopifyId),
	// 				first_name: lastInstaller.firstName,
	// 				last_name: lastInstaller.lastName,
	// 				email: lastInstaller.email,
	// 				account_owner: lastInstaller.isOwner,
	// 				locale: lastInstaller.locale,
	// 				collaborator: lastInstaller.isCollaborator,
	// 				email_verified: lastInstaller.emailVerified
	// 			}
	// 		};
	// 	}
	// }

	return sessionDto;
}

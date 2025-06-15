import { eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';
import type { TShopifySessionDto } from '../schema';

export async function getShopifySessionsByShop(shopId: string): Promise<TShopifySessionDto[]> {
	// Get all sessions for this shop
	const sessions = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopId));
	if (!sessions.length) {
		return [];
	}

	// const shopAccounts = await db
	// 	.select({
	// 		providerData: shopAccountTable.providerData
	// 	})
	// 	.from(shopAccountTable)
	// 	.where(
	// 		and(eq(shopAccountTable.provider, 'shopify'), eq(shopAccountTable.providerAccountId, shopId))
	// 	)
	// 	.limit(1);
	// const lastInstaller = shopAccounts[0]?.providerData?.lastInstaller;

	return sessions.map((session) => {
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
		// if (session.isOnline && lastInstaller != null) {
		// 	sessionDto.onlineAccessInfo = {
		// 		associated_user: {
		// 			id: parseInt(lastInstaller.shopifyId),
		// 			first_name: lastInstaller.firstName,
		// 			last_name: lastInstaller.lastName,
		// 			email: lastInstaller.email,
		// 			account_owner: lastInstaller.isOwner,
		// 			locale: lastInstaller.locale,
		// 			collaborator: lastInstaller.isCollaborator,
		// 			email_verified: lastInstaller.emailVerified
		// 		}
		// 	};
		// }

		return sessionDto;
	});
}

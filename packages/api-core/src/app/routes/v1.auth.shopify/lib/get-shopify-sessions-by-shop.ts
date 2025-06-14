import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable, shopifySessionTable } from '@/environment/db';
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

	// Get installer data from shop account (for online sessions)
	const shopAccounts = await db
		.select({
			providerData: shopAccountTable.providerData
		})
		.from(shopAccountTable)
		.where(
			and(eq(shopAccountTable.provider, 'shopify'), eq(shopAccountTable.providerAccountId, shopId))
		)
		.limit(1);
	const installer = shopAccounts[0]?.providerData?.installer;

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

		// Add installer data for online sessions
		if (session.isOnline && installer != null) {
			sessionDto.onlineAccessInfo = {
				associated_user: {
					id: parseInt(installer.shopifyId),
					first_name: installer.firstName,
					last_name: installer.lastName,
					email: installer.email,
					account_owner: installer.isOwner,
					locale: installer.locale,
					collaborator: installer.isCollaborator,
					email_verified: installer.emailVerified
				}
			};
		}

		return sessionDto;
	});
}

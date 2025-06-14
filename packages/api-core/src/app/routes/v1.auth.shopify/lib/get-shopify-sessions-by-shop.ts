import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable } from '@/environment/db';
import type { TShopifySessionDto } from '../schema';

export async function getShopifySessionsByShop(shopId: string): Promise<TShopifySessionDto[]> {
	const shopAccounts = await db
		.select({
			userId: shopAccountTable.userId,
			providerData: shopAccountTable.providerData,
			createdAt: shopAccountTable.createdAt
		})
		.from(shopAccountTable)
		.where(
			and(eq(shopAccountTable.provider, 'shopify'), eq(shopAccountTable.providerAccountId, shopId))
		);

	const sessions: TShopifySessionDto[] = [];

	for (const account of shopAccounts) {
		const providerData = account.providerData;
		if (providerData == null) {
			continue;
		}

		// Add online session if exists
		if (providerData.onlineSession) {
			const session: TShopifySessionDto = {
				id: providerData.onlineSession.sessionId,
				shop: shopId,
				state: providerData.onlineSession.state,
				isOnline: true,
				scope: providerData.onlineSession.scopes,
				expires: providerData.onlineSession.expiresAt,
				accessToken: providerData.onlineSession.accessToken,
				onlineAccessInfo:
					providerData.installer != null
						? {
								associated_user: {
									id: parseInt(providerData.installer.shopifyId),
									first_name: providerData.installer.firstName,
									last_name: providerData.installer.lastName,
									email: providerData.installer.email,
									account_owner: providerData.installer.isOwner,
									locale: providerData.installer.locale,
									collaborator: providerData.installer.isCollaborator,
									email_verified: providerData.installer.emailVerified
								}
							}
						: null
			};

			sessions.push(session);
		}

		// Add offline session if exists
		if (providerData.offlineSession) {
			sessions.push({
				id: providerData.offlineSession.sessionId,
				shop: shopId,
				state: providerData.offlineSession.state,
				isOnline: false,
				scope: providerData.offlineSession.scopes,
				expires: null,
				accessToken: providerData.offlineSession.accessToken,
				onlineAccessInfo: null
			});
		}
	}

	return sessions;
}

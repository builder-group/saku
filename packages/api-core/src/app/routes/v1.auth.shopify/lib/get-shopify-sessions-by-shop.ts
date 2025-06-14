import { notEmpty } from '@blgc/utils';
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

	return shopAccounts
		.map((account) => {
			const providerData = account.providerData;
			if (providerData == null) {
				return null;
			}

			// Reconstruct session data
			return {
				id: providerData.sessionId,
				shop: shopId,
				state: providerData.state,
				isOnline: providerData.isOnline,
				scope: providerData.scopes,
				expires: providerData.expiresAt,
				accessToken: providerData.accessToken,
				onlineAccessInfo: providerData.isOnline
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
		})
		.filter(notEmpty);
}

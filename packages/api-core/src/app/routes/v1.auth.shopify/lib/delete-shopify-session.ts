import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable, shopifySessionTable, TShopProviderType } from '@/environment/db';

export async function deleteShopifySession(sessionId: string): Promise<void> {
	await db.delete(shopifySessionTable).where(eq(shopifySessionTable.sessionId, sessionId));
}

export async function deleteShopAccount(
	provider: TShopProviderType,
	providerAccountId: string
): Promise<void> {
	await db.transaction(async (tx) => {
		// 1. Delete all sessions for this shop first
		await tx.delete(shopifySessionTable).where(eq(shopifySessionTable.shopId, providerAccountId));

		// 2. Delete the shop account
		await tx
			.delete(shopAccountTable)
			.where(
				and(
					eq(shopAccountTable.provider, provider),
					eq(shopAccountTable.providerAccountId, providerAccountId)
				)
			);
	});
}

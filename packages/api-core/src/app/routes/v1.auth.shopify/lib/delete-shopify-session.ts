import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable, shopifySessionTable, TShopProviderType } from '@/environment/db';

export async function deleteShopifySession(sessionId: string): Promise<void> {
	const deletedSessions = await db
		.delete(shopifySessionTable)
		.where(eq(shopifySessionTable.sessionId, sessionId))
		.returning({ sessionId: shopifySessionTable.sessionId });

	if (!deletedSessions.length) {
		throw new AppError('#ERR_SESSION_NOT_FOUND', 404, {
			detail: 'Shopify session not found'
		});
	}
}

export async function deleteShopAccount(
	provider: TShopProviderType,
	providerAccountId: string
): Promise<void> {
	await db.transaction(async (tx) => {
		// 1. Delete all sessions for this shop first
		await tx.delete(shopifySessionTable).where(eq(shopifySessionTable.shopId, providerAccountId));

		// 2. Delete the shop account
		const deletedAccounts = await tx
			.delete(shopAccountTable)
			.where(
				and(
					eq(shopAccountTable.provider, provider),
					eq(shopAccountTable.providerAccountId, providerAccountId)
				)
			)
			.returning({ userId: shopAccountTable.userId });

		if (!deletedAccounts.length) {
			throw new AppError('#ERR_SHOP_ACCOUNT_NOT_FOUND', 404, {
				detail: 'Shop account not found'
			});
		}
	});
}

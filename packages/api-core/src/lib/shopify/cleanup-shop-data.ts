import { and, eq } from 'drizzle-orm';
import {
	db,
	redisClient,
	shopifySessionTable,
	workspaceAccountTable,
	workspaceTable
} from '@/environment';
import { createHandleFromShop } from './create-handle-from-shop';

export async function cleanupShopData(shopId: string): Promise<void> {
	// 1. Delete Shopify sessions for this shop (DB + Redis cache)
	const deletedSessions = await db
		.delete(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopId))
		.returning({ sessionId: shopifySessionTable.sessionId });

	// Invalidate Redis cache for deleted sessions
	for (const session of deletedSessions) {
		await redisClient.deleteShopifySession(session.sessionId);
	}
	await redisClient.deleteShopifySessionsByShop(shopId);

	// 2. Delete workspace account data (Shopify store connection)
	const deletedShopifyAccounts = await db
		.delete(workspaceAccountTable)
		.where(
			and(
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		)
		.returning({ workspaceId: workspaceAccountTable.workspaceId });

	const shopHandle = createHandleFromShop(shopId);

	// 3. Delete workspace if it was created specifically for this Shopify store
	// and no other accounts are connected to it
	// Note: Currently, workspace = single Shopify store (1:1 relationship)
	// While the schema supports multiple stores per workspace (future SaaS),
	// we currently enforce 1 store = 1 workspace for simplicity.
	// This is enforced by setting the workspace handle to the shop handle.
	for (const deletedShopifyAccount of deletedShopifyAccounts) {
		const workspaceId = deletedShopifyAccount.workspaceId;

		// Get workspace info and remaining account count
		const [workspace] = await db
			.select({
				id: workspaceTable.id,
				remainingAccountCount: db.$count(
					workspaceAccountTable,
					eq(workspaceAccountTable.workspaceId, workspaceId)
				)
			})
			.from(workspaceTable)
			.where(and(eq(workspaceTable.id, workspaceId), eq(workspaceTable.handle, shopHandle)))
			.limit(1);

		// Only delete if workspace exists with correct handle and has no remaining accounts
		// Note: Shopify account was deleted in the previous step
		// Note: This will cascade delete: sites, workspace members, and all related content
		if (workspace != null && workspace.remainingAccountCount === 0) {
			await db.delete(workspaceTable).where(eq(workspaceTable.id, workspaceId));
		}
	}
}

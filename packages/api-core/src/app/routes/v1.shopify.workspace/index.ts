import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, workspaceAccountTable, workspaceTable } from '@/environment';
import { verifyShopifySession } from '@/lib';
import { GetShopifyWorkspaceRoute } from './schema';

router.openapi(GetShopifyWorkspaceRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);

	// Find workspace connected to this Shopify shop
	const [workspace] = await db
		.select({
			id: workspaceTable.id,
			handle: workspaceTable.handle,
			displayName: workspaceTable.displayName,
			image: workspaceTable.image,
			onboardingCompletedAt: workspaceTable.onboardingCompletedAt,
			createdAt: workspaceTable.createdAt,
			updatedAt: workspaceTable.updatedAt
		})
		.from(workspaceTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, workspaceTable.id),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		)
		.limit(1);
	if (workspace == null) {
		throw new AppError('#ERR_WORKSPACE_NOT_FOUND', 404, {
			title: 'Workspace not found',
			detail: `No workspace found for shop ${shopId}`
		});
	}

	return c.json(
		{
			id: workspace.id,
			handle: workspace.handle,
			displayName: workspace.displayName ?? undefined,
			image: workspace.image ?? undefined,
			onboardingCompletedAt: workspace.onboardingCompletedAt?.toISOString() ?? null,
			createdAt: workspace.createdAt.toISOString(),
			updatedAt: workspace.updatedAt.toISOString()
		},
		200
	);
});

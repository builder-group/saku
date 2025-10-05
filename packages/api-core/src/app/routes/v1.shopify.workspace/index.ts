import { AppError } from '@repo/hono-utils';
import { and, eq, ne } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, workspaceAccountTable, workspaceTable } from '@/environment';
import { verifyShopifySession } from '@/lib';
import { GetShopifyWorkspaceRoute, UpdateShopifyWorkspaceRoute } from './schema';

router.openapi(GetShopifyWorkspaceRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

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

router.openapi(UpdateShopifyWorkspaceRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const body = c.req.valid('json');

	// Find workspace connected to this Shopify shop
	const [workspace] = await db
		.select({
			id: workspaceTable.id,
			handle: workspaceTable.handle
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

	// Check if handle is already taken by a different workspace (if handle is being updated)
	if (body.handle != null && body.handle !== workspace.handle) {
		const [existingWorkspace] = await db
			.select({ id: workspaceTable.id })
			.from(workspaceTable)
			.where(and(eq(workspaceTable.handle, body.handle), ne(workspaceTable.id, workspace.id)))
			.limit(1);

		if (existingWorkspace != null) {
			throw new AppError('#ERR_WORKSPACE_HANDLE_TAKEN', 409, {
				title: 'Handle already taken',
				detail: `The handle "${body.handle}" is already used by another workspace`
			});
		}
	}

	// Update workspace
	const [updatedWorkspace] = await db
		.update(workspaceTable)
		.set({
			...(body.handle != null && { handle: body.handle }),
			...(body.displayName != null && { displayName: body.displayName }),
			...(body.image != null && { image: body.image }),
			updatedAt: new Date()
		})
		.where(eq(workspaceTable.id, workspace.id))
		.returning();
	if (updatedWorkspace == null) {
		throw new AppError('#ERR_WORKSPACE_UPDATE_FAILED', 500, {
			title: 'Failed to update workspace',
			detail: 'An error occurred while updating the workspace'
		});
	}

	return c.json(
		{
			id: updatedWorkspace.id,
			handle: updatedWorkspace.handle,
			displayName: updatedWorkspace.displayName ?? undefined,
			image: updatedWorkspace.image ?? undefined,
			onboardingCompletedAt: updatedWorkspace.onboardingCompletedAt?.toISOString() ?? null,
			createdAt: updatedWorkspace.createdAt.toISOString(),
			updatedAt: updatedWorkspace.updatedAt.toISOString()
		},
		200
	);
});

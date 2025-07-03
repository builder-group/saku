import { AppError } from '@repo/hono-utils';
import { and, eq, isNull } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, siteTable, workspaceAccountTable, workspaceTable } from '@/environment';
import { verifyShopifySession } from '@/lib';
import {
	CreateShopifySiteRoute,
	GetShopifySitesRoute,
	GetSiteContentByShopAndHandleRoute,
	UpdateShopifySiteContentRoute
} from './schema';

router.openapi(GetShopifySitesRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);

	// Find sites in workspaces that have this Shopify store connected
	const sites = await db
		.select({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		})
		.from(siteTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, siteTable.workspaceId),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		);

	return c.json(
		sites.map((site) => ({
			id: site.id,
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		})),
		200
	);
});

router.openapi(CreateShopifySiteRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);
	const { handle, displayName, content } = c.req.valid('json');

	// Find workspace connected to this Shopify shop
	const [workspace] = await db
		.select({
			id: workspaceTable.id
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

	// Check if handle already exists for this workspace
	const [existingSite] = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.where(and(eq(siteTable.workspaceId, workspace.id), eq(siteTable.handle, handle)))
		.limit(1);
	if (existingSite != null) {
		throw new AppError('#ERR_SITE_HANDLE_EXISTS', 409, {
			title: 'Handle already exists',
			detail: `A site with handle '${handle}' already exists in this workspace`
		});
	}

	// Create the site
	const [site] = await db
		.insert(siteTable)
		.values({
			workspaceId: workspace.id,
			handle,
			displayName,
			content,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.returning({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			content: siteTable.content,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		});
	if (site == null) {
		throw new AppError('#ERR_SITE_CREATE_FAILED', 500, {
			title: 'Site creation failed',
			detail: 'Failed to create site'
		});
	}

	// Mark onboarding as complete (first site created)
	await db
		.update(workspaceTable)
		.set({
			onboardingCompletedAt: new Date(),
			updatedAt: new Date()
		})
		.where(and(eq(workspaceTable.id, workspace.id), isNull(workspaceTable.onboardingCompletedAt)));

	return c.json(
		{
			id: site.id,
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			content: site.content,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		},
		201
	);
});

router.openapi(UpdateShopifySiteContentRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);
	const { siteId } = c.req.valid('param');
	const { content } = c.req.valid('json');

	// Check if site exists and belongs to a workspace connected to this Shopify shop
	const [existingSite] = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, siteTable.workspaceId),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		)
		.where(eq(siteTable.id, siteId))
		.limit(1);

	if (existingSite == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with ID ${siteId} was not found or you don't have access to it`
		});
	}

	const [site] = await db
		.update(siteTable)
		.set({
			content,
			updatedAt: new Date()
		})
		.where(eq(siteTable.id, siteId))
		.returning({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			content: siteTable.content,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		});

	if (site == null) {
		throw new AppError('#ERR_SITE_UPDATE_FAILED', 500, {
			title: 'Update failed',
			detail: 'Failed to update site content'
		});
	}

	return c.json(
		{
			id: site.id,
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			content: site.content,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		},
		200
	);
});

router.openapi(GetSiteContentByShopAndHandleRoute, async (c) => {
	const { shop, handle } = c.req.valid('param');

	// Find site by handle in workspace connected to this Shopify shop
	const [site] = await db
		.select({
			content: siteTable.content
		})
		.from(siteTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, siteTable.workspaceId),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shop)
			)
		)
		.where(eq(siteTable.handle, handle))
		.limit(1);

	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with handle '${handle}' not found for shop '${shop}'`
		});
	}

	return c.json(site.content, 200);
});

import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, siteAccountTable, siteConnectionTable, siteTable } from '@/environment';
import { verifyShopifySession } from '@/lib';
import {
	GetShopifySitesRoute,
	GetSiteContentByShopAndHandleRoute,
	UpdateShopifySiteContentRoute
} from './schema';

router.openapi(GetShopifySitesRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);

	const sites = await db
		.select({
			id: siteTable.id,
			userId: siteTable.userId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		})
		.from(siteTable)
		.innerJoin(siteConnectionTable, eq(siteConnectionTable.siteId, siteTable.id))
		.innerJoin(
			siteAccountTable,
			eq(siteAccountTable.providerAccountId, shopId) &&
				eq(siteAccountTable.provider, 'shopify') &&
				eq(siteAccountTable.provider, siteConnectionTable.provider) &&
				eq(siteAccountTable.providerAccountId, siteConnectionTable.providerAccountId)
		);

	return c.json(
		sites.map((site) => ({
			id: site.id,
			userId: site.userId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		})),
		200
	);
});

router.openapi(UpdateShopifySiteContentRoute, async (c) => {
	const { siteId } = c.req.valid('param');
	const { content } = c.req.valid('json');
	const { shopId } = await verifyShopifySession(c);

	// Check if site exists and is connected to this Shopify shop
	const [existingSite] = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.innerJoin(siteConnectionTable, eq(siteConnectionTable.siteId, siteTable.id))
		.innerJoin(
			siteAccountTable,
			eq(siteAccountTable.providerAccountId, shopId) &&
				eq(siteAccountTable.provider, 'shopify') &&
				eq(siteAccountTable.provider, siteConnectionTable.provider) &&
				eq(siteAccountTable.providerAccountId, siteConnectionTable.providerAccountId)
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
			userId: siteTable.userId,
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
			userId: site.userId,
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

	const [site] = await db
		.select({
			content: siteTable.content
		})
		.from(siteTable)
		.innerJoin(siteConnectionTable, eq(siteTable.id, siteConnectionTable.siteId))
		.innerJoin(
			siteAccountTable,
			and(
				eq(siteConnectionTable.provider, siteAccountTable.provider),
				eq(siteConnectionTable.providerAccountId, siteAccountTable.providerAccountId)
			)
		)
		.where(
			and(
				eq(siteTable.handle, handle),
				eq(siteAccountTable.provider, 'shopify'),
				eq(siteAccountTable.providerAccountId, shop)
			)
		)
		.limit(1);

	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with handle '${handle}' not found for shop '${shop}'`
		});
	}

	return c.json(site.content, 200);
});

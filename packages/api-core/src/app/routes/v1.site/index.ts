import { AppError } from '@repo/hono-utils';
import { eq } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, siteTable } from '@/environment';
import { GetSiteContentRoute, GetSiteRoute } from './schema';

router.openapi(GetSiteRoute, async (c) => {
	const { siteId } = c.req.valid('param');

	const [site] = await db
		.select({
			id: siteTable.id,
			userId: siteTable.userId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			content: siteTable.content,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		})
		.from(siteTable)
		.where(eq(siteTable.id, siteId))
		.limit(1);

	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with ID ${siteId} was not found`
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

router.openapi(GetSiteContentRoute, async (c) => {
	const { siteId } = c.req.valid('param');

	const [site] = await db
		.select({
			content: siteTable.content
		})
		.from(siteTable)
		.where(eq(siteTable.id, siteId))
		.limit(1);

	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with ID ${siteId} was not found`
		});
	}

	return c.json(site.content, 200);
});

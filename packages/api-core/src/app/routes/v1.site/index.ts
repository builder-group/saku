import { parseUrl } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { and, eq, sql } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, siteTable, workspaceTable } from '@/environment';
import { migrateSiteIfNeeded, refreshIntegrations, verifyAccessSecret } from '@/lib';
import { parseLinkpopSite, parseSakuSite } from './lib';
import {
	GetSiteByWorkspaceAndHandleRoute,
	GetSiteRoute,
	ParseExternalSiteRoute,
	TFlatSiteContentDto,
	TParsedExternalSite,
	UpdateSiteNodeRoute
} from './schema';

router.openapi(GetSiteRoute, async (c) => {
	const { siteId } = c.req.valid('param');

	const [site] = await db
		.select({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
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
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			content: site.content as TFlatSiteContentDto,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		},
		200
	);
});

router.openapi(GetSiteByWorkspaceAndHandleRoute, async (c) => {
	const { workspaceHandle, handle } = c.req.valid('param');

	// Find workspace by handle
	const [workspace] = await db
		.select({ id: workspaceTable.id })
		.from(workspaceTable)
		.where(eq(workspaceTable.handle, workspaceHandle))
		.limit(1);
	if (workspace == null) {
		throw new AppError('#ERR_WORKSPACE_NOT_FOUND', 404, {
			title: 'Workspace not found',
			detail: `Workspace with handle '${workspaceHandle}' was not found`
		});
	}

	// Find site by handle and workspace id
	const [site] = await db
		.select({ id: siteTable.id, content: siteTable.content })
		.from(siteTable)
		.where(and(eq(siteTable.workspaceId, workspace.id), eq(siteTable.handle, handle)))
		.limit(1);
	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with handle '${handle}' not found in workspace '${workspaceHandle}'`
		});
	}

	// Migrate site to latest version if needed
	const migratedContent = await migrateSiteIfNeeded(site.id, site.content);

	// Refresh integrations
	migratedContent.integrations = (
		await refreshIntegrations({
			siteId: site.id,
			workspaceId: workspace.id,
			integrations: migratedContent.integrations
		})
	).integrations;

	return c.json(
		{
			id: site.id,
			content: migratedContent as TFlatSiteContentDto
		},
		200
	);
});

router.openapi(UpdateSiteNodeRoute, async (c) => {
	(await verifyAccessSecret(c)).unwrap();
	const { siteId, nodeId } = c.req.valid('param');
	const node = c.req.valid('json');

	const [updated] = await db
		.update(siteTable)
		.set({
			content: sql.raw(
				`jsonb_set(content, '{nodes,"${nodeId}"}', '${JSON.stringify(node)}'::jsonb, true)`
			),
			updatedAt: new Date()
		})
		.where(eq(siteTable.id, siteId))
		.returning({ id: siteTable.id });

	if (updated == null) {
		throw new AppError('#ERR_SITE_UPDATE_FAILED', 500, {
			title: 'Update failed',
			detail: 'Failed to update node in site'
		});
	}

	return c.json({ success: true as const }, 200);
});

router.openapi(ParseExternalSiteRoute, async (c) => {
	const { url: urlString } = c.req.valid('query');

	const url = parseUrl(urlString);
	if (url == null) {
		throw new AppError('#ERR_INVALID_URL_FORMAT', 400, {
			title: 'Invalid URL format',
			detail: 'The provided URL is not in a valid format'
		});
	}

	const hostname = url.hostname.toLowerCase();

	switch (hostname) {
		case 'linkpop.com':
		case 'www.linkpop.com': {
			const { handle, content } = await parseLinkpopSite(url);
			return c.json(
				{
					provider: 'linkpop',
					handle,
					content: content as TFlatSiteContentDto
				} satisfies TParsedExternalSite,
				200
			);
		}
		case 'saku.so':
		case 'www.saku.so':
		case 'sfy-link-in-bio-app.saku.so': {
			const { workspaceHandle, siteHandle, content } = await parseSakuSite(url);
			return c.json(
				{
					provider: 'saku',
					workspaceHandle,
					siteHandle,
					content: content as TFlatSiteContentDto
				} satisfies TParsedExternalSite,
				200
			);
		}
		default:
			throw new AppError('#ERR_UNSUPPORTED_PROVIDER', 400, {
				title: 'Unsupported provider',
				detail: `Provider ${hostname} is not supported. Currently supported: linkpop.com, saku.so`
			});
	}
});

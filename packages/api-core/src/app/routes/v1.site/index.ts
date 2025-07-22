import { toFlatSite } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { and, eq, sql } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, siteTable, workspaceAccountTable, workspaceTable } from '@/environment';
import { getShopifyOfflineAccessToken, getStorefrontToken, verifyAccessSecret } from '@/lib';
import { fetchExternalHtml, parseLinkpopHtml, transformLinkpopToSite } from './lib';
import {
	GetSiteByWorkspaceAndHandleRoute,
	GetSiteRoute,
	ParseExternalSiteRoute,
	TFlatSiteContentDto,
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

	let storefrontAccessToken: string | undefined;

	// Find Shopify storefront access token
	const [workspaceAccount] = await db
		.select({
			providerAccountId: workspaceAccountTable.providerAccountId
		})
		.from(workspaceAccountTable)
		.where(
			and(
				eq(workspaceAccountTable.workspaceId, workspace.id),
				eq(workspaceAccountTable.provider, 'shopify')
			)
		)
		.limit(1);
	if (workspaceAccount != null) {
		const accessToken = (
			await getShopifyOfflineAccessToken(workspaceAccount.providerAccountId)
		).unwrap();

		// Get or create storefront access token for the workspace
		const storefrontTokenResult = await getStorefrontToken(workspace.id, {
			accessToken,
			shopId: workspaceAccount.providerAccountId
		});
		if (storefrontTokenResult.isOk()) {
			storefrontAccessToken = storefrontTokenResult.value;
		}
	}

	return c.json(
		{
			id: site.id,
			content: site.content as TFlatSiteContentDto,
			storefrontAccessToken
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

	let url: URL;
	try {
		url = new URL(urlString);
	} catch (error) {
		throw new AppError('#ERR_INVALID_URL_FORMAT', 400, {
			title: 'Invalid URL format',
			detail: 'The provided URL is not in a valid format'
		});
	}

	const hostname = url.hostname.toLowerCase();
	const pathname = url.pathname;

	switch (hostname) {
		case 'linkpop.com':
		case 'www.linkpop.com': {
			const handle = pathname.substring(1);
			const html = await fetchExternalHtml(`https://linkpop.com/${handle}`);
			const parsedData = await parseLinkpopHtml(html);
			const site = transformLinkpopToSite(parsedData);

			return c.json(
				{
					provider: 'linkpop',
					handle: handle,
					content: toFlatSite(site) as TFlatSiteContentDto
				},
				200
			);
		}

		default:
			throw new AppError('#ERR_UNSUPPORTED_PROVIDER', 400, {
				title: 'Unsupported provider',
				detail: `Provider ${hostname} is not supported. Currently supported: linkpop.com`
			});
	}
});

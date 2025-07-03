import { AppError } from '@repo/hono-utils';
import { eq } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, siteTable } from '@/environment';
import { fetchExternalHtml, parseLinkpopHtml, transformLinkpopToSite } from './lib';
import { GetSiteContentRoute, GetSiteRoute, ParseExternalSiteRoute } from './schema';

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
					data: site as any
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

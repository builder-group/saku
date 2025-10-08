import { TFlatSite, toFlatSite } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { fetchExternalHtml } from '../fetch-external-html';
import { parseLinkpopData } from './parse-linkpop-data';
import { parseLinkpopHtml } from './parse-linkpop-html';

export async function parseLinkpopSite(url: URL): Promise<TLinkpopSiteData> {
	const pathname = url.pathname;

	// Parse linkpop.com URL format: /{handle}/index.html
	const pathParts = pathname.split('/').filter(Boolean);
	if (pathParts.length < 1) {
		throw new AppError('#ERR_INVALID_LINKPOP_URL_FORMAT', 400, {
			title: 'Invalid LinkPop URL format',
			detail: 'LinkPop URLs must follow the format: https://linkpop.com/{handle}'
		});
	}

	const handle = pathParts[0];
	if (handle == null) {
		throw new AppError('#ERR_INVALID_LINKPOP_URL_FORMAT', 400, {
			title: 'Invalid LinkPop URL format',
			detail: 'LinkPop URLs must follow the format: https://linkpop.com/{handle}'
		});
	}

	const html = await fetchExternalHtml(`https://linkpop.com/${handle}`);
	const parsedData = await parseLinkpopHtml(html);
	const site = parseLinkpopData(parsedData);

	return {
		handle,
		content: toFlatSite(site)
	};
}

export interface TLinkpopSiteData {
	handle: string;
	content: TFlatSite;
}

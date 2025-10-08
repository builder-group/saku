import { TFlatSite, toFlatSite } from '@repo/editor';
import { fetchExternalHtml } from '../fetch-external-html';
import { parseLinkpopData } from './parse-linkpop-data';
import { parseLinkpopHtml } from './parse-linkpop-html';

export async function parseLinkpopSite(url: URL): Promise<TLinkpopSiteData> {
	const pathname = url.pathname;
	const handle = pathname.substring(1);
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

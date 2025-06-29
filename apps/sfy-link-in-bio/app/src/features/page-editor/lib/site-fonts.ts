import { TSite } from '@/features/page-editor';

/**
 * Extract font URLs from a site's assets for static rendering
 */
export function extractSiteFontUrls(site: TSite): string[] {
	return site.assets
		.filter((asset) => asset.type === 'font' && asset.content.type === 'url')
		.map((asset) => {
			if (asset.content.type === 'url') {
				return asset.content.url;
			}
			return '';
		})
		.filter(Boolean);
}

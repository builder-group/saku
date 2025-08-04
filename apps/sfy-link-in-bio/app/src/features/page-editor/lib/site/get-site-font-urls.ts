import { notEmpty } from '@blgc/utils';
import { TFlatSite } from '@repo/editor';

export function getSiteFontUrls(site: TFlatSite): string[] {
	return Object.values(site.assets)
		.filter((asset) => asset.type === 'font')
		.map((asset) => (asset.storage.type === 'url' ? asset.storage.url : null))
		.filter(notEmpty);
}

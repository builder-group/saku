import { notEmpty } from '@blgc/utils';
import { TSite } from '@repo/editor';
import { TResolvedSite } from '../types';

export function getSiteFontUrls(site: TSite | TResolvedSite): string[] {
	return site.assets
		.filter((asset) => asset.type === 'font')
		.map((asset) => (asset.storage.type === 'url' ? asset.storage.url : null))
		.filter(notEmpty);
}

import { notEmpty } from '@blgc/utils';
import { TAsset, TAssetHash } from '@repo/editor';

export function getFontUrls(assets: Record<TAssetHash, TAsset>): string[] {
	return Object.values(assets)
		.filter((asset) => asset.type === 'font')
		.map((asset) => (asset.storage.type === 'url' ? asset.storage.url : null))
		.filter(notEmpty);
}

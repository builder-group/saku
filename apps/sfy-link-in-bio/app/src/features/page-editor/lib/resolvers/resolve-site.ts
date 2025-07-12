import { TAsset, TAssetHash, TSite } from '@repo/editor';
import { TResolvedSite } from '../../types';
import { resolvePageNode } from './resolve-page-node';

export function resolveSite(site: TSite): TResolvedSite {
	const assetsMap = site.assets.reduce(
		(map, asset) => {
			map[asset.hash] = asset;
			return map;
		},
		{} as Record<TAssetHash, TAsset>
	);

	return {
		...site,
		root: resolvePageNode(site.root, { assetsMap })
	};
}

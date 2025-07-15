import { TFlatPageNode, TFlatSite } from '@repo/editor';
import { TResolvedSite } from '../../../types';
import { StaticSiteProvider } from '../site-provider';
import { resolvePageNode } from './resolve-page-node';

export function resolveSite(site: TFlatSite, shopId: string): TResolvedSite {
	const { rootId, nodes, assets, ...rest } = site;
	const root = nodes[rootId] as TFlatPageNode;

	return {
		...rest,
		root: resolvePageNode(root, {
			site: new StaticSiteProvider(site, shopId)
		})
		// assets: Object.values(assets)
	};
}

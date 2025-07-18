import { TFlatPageNode } from '@repo/editor';
import { TResolvedSite } from '../../../../types';
import { TSiteHydrateContext } from '../types';
import { hydratePageNode } from './hydrate-page-node';

export function hydrateSite(cx: TSiteHydrateContext): TResolvedSite {
	const { rootId, nodes, assets: _, ...rest } = cx.getSite();
	const root = nodes[rootId] as TFlatPageNode;

	return {
		...rest,
		root: hydratePageNode(root, {
			site: cx
		})
	};
}

import { TFlatPageNode } from '@repo/editor';
import { hydratePageNode } from '../../../features/node/.server';
import { TResolvedSite } from '../../../types';
import { TSiteHydrateContext } from '../types';

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

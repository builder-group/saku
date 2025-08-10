import { TFlatPageNode } from '@repo/editor';
import { resolvePageNode } from '../../../nodes';
import { TResolvedSite } from '../../../types';
import { TSiteResolveContext } from '../types';

export function resolveSite(cx: TSiteResolveContext): TResolvedSite {
	const { rootId, nodes, assets: _, ...rest } = cx.getSite();
	const root = nodes[rootId] as TFlatPageNode;

	return {
		...rest,
		root: resolvePageNode(root, {
			site: cx
		})
	};
}

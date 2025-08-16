import { TFlatPageNode } from '@repo/editor';
import { Err, Ok, type TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolvePageNode } from '../../../nodes';
import { TResolvedSite } from '../../../types';
import { TSiteResolveContext } from '../types';

export function resolveSite(cx: TSiteResolveContext): TResult<TResolvedSite, AppError> {
	const { rootId, nodes, assets: _, ...rest } = cx.getSite();
	const root = nodes[rootId] as TFlatPageNode;

	const [isOk, error, resolvedPageNode] = resolvePageNode(root, {
		site: cx
	});
	if (!isOk) {
		return Err(error.wrapWith('#ERR_RESOLVE_PAGE_NODE'));
	}

	return Ok({
		...rest,
		root: resolvedPageNode
	});
}

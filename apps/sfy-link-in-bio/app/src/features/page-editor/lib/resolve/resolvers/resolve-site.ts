import { Err, Ok, TResult } from '@blgc/utils';
import { TFlatPageNode } from '@repo/editor';
import { AppError } from '@/lib';
import { resolvePageNode } from '../../../nodes';
import { TResolvedSite } from '../../../types';
import { TSiteResolveContext } from '../types';

export function resolveSite(cx: TSiteResolveContext): TResult<TResolvedSite, AppError> {
	const { rootId, nodes, assets: _, ...rest } = cx.getSite();
	const root = nodes[rootId] as TFlatPageNode;

	const resolvePageNodeResult = resolvePageNode(root, {
		site: cx
	});
	if (resolvePageNodeResult.isErr()) {
		return Err(AppError.wrap(resolvePageNodeResult.error, '#ERR_RESOLVE_PAGE_NODE'));
	}

	return Ok({
		...rest,
		root: resolvePageNodeResult.value
	});
}

import { Err, Ok, TResult } from '@blgc/utils';
import { TFlatPageNode } from '@repo/editor';
import { AppError } from '@/lib';
import { TResolvedSite } from '../../../../types';
import { hydratePageNode } from '../../../nodes';
import { TSiteHydrateContext } from '../types';

export function hydrateSite(cx: TSiteHydrateContext): TResult<TResolvedSite, AppError> {
	const { rootId, nodes, assets: _, ...rest } = cx.getSite();
	const root = nodes[rootId] as TFlatPageNode;

	const hydratePageNodeResult = hydratePageNode(root, {
		site: cx
	});
	if (hydratePageNodeResult.isErr()) {
		return Err(AppError.wrap(hydratePageNodeResult.error, '#ERR_HYDRATE_PAGE_NODE'));
	}

	return Ok({
		...rest,
		root: hydratePageNodeResult.value
	});
}

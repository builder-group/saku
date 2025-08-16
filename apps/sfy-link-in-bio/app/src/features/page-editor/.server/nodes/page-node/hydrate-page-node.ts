import { notEmpty } from '@blgc/utils';
import { TFlatNode, TFlatPageNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { logger } from '@/environment';
import { AppError } from '@/lib';
import { resolveFlatNode } from '../../../mixins';
import { resolvePageNodeWithoutChildren, TResolvedPageNode } from '../../../nodes';
import { TResolvedNode } from '../../../types';
import { TNodeHydrateContext } from '../../lib';
import { hydrateLinkNode } from '../link-node/hydrate-link-node';
import { hydrateProductNode } from '../product-node/hydrate-product-node';

export function hydratePageNode(
	node: TFlatPageNode,
	cx: TNodeHydrateContext
): TResult<TResolvedPageNode, AppError> {
	const [
		isResolvedPageNodeWithoutChildrenOk,
		resolvedPageNodeWithoutChildrenErr,
		resolvedPageNodeWithoutChildren
	] = resolvePageNodeWithoutChildren(node, cx);
	if (!isResolvedPageNodeWithoutChildrenOk) {
		return Err(resolvedPageNodeWithoutChildrenErr.wrapWith('#ERR_RESOLVE_PAGE_NODE'));
	}

	return Ok({
		...resolvedPageNodeWithoutChildren,
		children: node.children
			.map((childId) => {
				const childNode = cx.site.getNode(childId);
				if (childNode == null) {
					return null;
				}
				const result = hydrateFlatNode(childNode, {
					site: cx.site,
					parentId: node.id,
					childMixins: node.childMixins
				});
				if (result.isErr()) {
					logger.warn('Failed to resolve flat node', {
						error: result.error,
						childId
					});
					return null;
				}
				return result.value;
			})
			.filter(notEmpty)
	});
}

function hydrateFlatNode(
	node: TFlatNode,
	cx: TNodeHydrateContext
): TResult<TResolvedNode, AppError> {
	switch (node.type) {
		case 'link': {
			const result = hydrateLinkNode(node, cx);
			if (result.isErr()) {
				return Err(result.error.wrapWith('#ERR_HYDRATE_LINK_NODE'));
			}
			return Ok(result.value);
		}
		case 'product': {
			const result = hydrateProductNode(node, cx);
			if (result.isErr()) {
				return Err(result.error.wrapWith('#ERR_HYDRATE_PRODUCT_NODE'));
			}
			return Ok(result.value);
		}
		default: {
			const result = resolveFlatNode(node, cx);
			if (result.isErr()) {
				return Err(result.error.wrapWith('#ERR_RESOLVE_FLAT_NODE'));
			}
			return Ok(result.value);
		}
	}
}

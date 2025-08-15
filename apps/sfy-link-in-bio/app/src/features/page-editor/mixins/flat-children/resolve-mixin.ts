import { Err, notEmpty, Ok, TResult } from '@blgc/utils';
import { TFlatChildrenMixin, TFlatNode } from '@repo/editor';
import { logger } from '@/environment';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../lib';
import {
	resolveAboutNode,
	resolveLinkNode,
	resolveMediaNode,
	resolveProductNode,
	resolveTextNode
} from '../../nodes';
import { TResolvedNode } from '../../types';
import { TResolvedChildrenMixin } from './types';

export function resolveFlatChildrenMixin(
	children: TFlatChildrenMixin['value'],
	parent: TFlatNode,
	cx: TNodeResolveContext
): TResolvedChildrenMixin['value'] {
	return children
		.map((childId) => {
			const childNode = cx.site.getNode(childId);
			if (childNode == null) {
				return null;
			}
			const result = resolveFlatNode(childNode, {
				site: cx.site,
				parentId: parent.id,
				childMixins: 'childMixins' in parent ? parent.childMixins : undefined
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
		.filter(notEmpty);
}

export function resolveFlatNode(
	node: TFlatNode,
	cx: TNodeResolveContext
): TResult<TResolvedNode, AppError> {
	switch (node.type) {
		case 'about': {
			const result = resolveAboutNode(node, cx);
			if (result.isErr()) {
				return Err(AppError.wrap(result.error, '#ERR_RESOLVE_ABOUT_NODE'));
			}
			return Ok(result.value);
		}
		case 'link': {
			const result = resolveLinkNode(node, cx);
			if (result.isErr()) {
				return Err(AppError.wrap(result.error, '#ERR_RESOLVE_LINK_NODE'));
			}
			return Ok(result.value);
		}
		case 'media': {
			const result = resolveMediaNode(node, cx);
			if (result.isErr()) {
				return Err(AppError.wrap(result.error, '#ERR_RESOLVE_MEDIA_NODE'));
			}
			return Ok(result.value);
		}
		case 'text': {
			const result = resolveTextNode(node, cx);
			if (result.isErr()) {
				return Err(AppError.wrap(result.error, '#ERR_RESOLVE_TEXT_NODE'));
			}
			return Ok(result.value);
		}
		case 'product': {
			const result = resolveProductNode(node, cx);
			if (result.isErr()) {
				return Err(AppError.wrap(result.error, '#ERR_RESOLVE_PRODUCT_NODE'));
			}
			return Ok(result.value);
		}
		default: {
			return Err(
				new AppError('#ERR_UNSUPPORTED_NODE_TYPE', {
					detail: `Unsupported node type: ${node.type}`
				})
			);
		}
	}
}

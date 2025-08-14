import { notEmpty } from '@blgc/utils';
import { TFlatChildrenMixin, TFlatNode, TMixin } from '@repo/editor';
import {
	resolveAboutNode,
	resolveLinkNode,
	resolveMediaNode,
	resolveProductNode,
	resolveTextNode
} from '../../../nodes';
import { TResolvedNode } from '../../../types';
import { TNodeResolveContext } from '../types';

export function resolveFlatChildren(
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
			return resolveFlatNode(childNode, {
				site: cx.site,
				parentId: parent.id,
				childMixins: 'childMixins' in parent ? parent.childMixins : undefined
			});
		})
		.filter(notEmpty);
}

export function resolveFlatNode(node: TFlatNode, cx: TNodeResolveContext): TResolvedNode | null {
	switch (node.type) {
		case 'about':
			return resolveAboutNode(node, cx);
		case 'link':
			return resolveLinkNode(node, cx);
		case 'media':
			return resolveMediaNode(node, cx);
		case 'text':
			return resolveTextNode(node, cx);
		case 'product':
			return resolveProductNode(node, cx);
		default:
			return null;
	}
}

export type TResolvedChildrenMixin = TMixin<'children', TResolvedNode[]>;

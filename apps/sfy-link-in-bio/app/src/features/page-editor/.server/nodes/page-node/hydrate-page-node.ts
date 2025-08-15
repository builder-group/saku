import { notEmpty } from '@blgc/utils';
import { TFlatNode, TFlatPageNode } from '@repo/editor';
import { resolveFlatNode } from '../../../mixins';
import { resolvePageNodeWithoutChildren, TResolvedPageNode } from '../../../nodes';
import { TResolvedNode } from '../../../types';
import { TNodeHydrateContext } from '../../lib';
import { hydrateLinkNode } from '../link-node/hydrate-link-node';
import { hydrateProductNode } from '../product-node/hydrate-product-node';

export function hydratePageNode(node: TFlatPageNode, cx: TNodeHydrateContext): TResolvedPageNode {
	return {
		...resolvePageNodeWithoutChildren(node, cx),
		children: node.children
			.map((childId) => {
				const childNode = cx.site.getNode(childId);
				if (childNode == null) {
					return null;
				}
				return hydrateFlatNode(childNode, {
					site: cx.site,
					parentId: node.id,
					childMixins: node.childMixins
				});
			})
			.filter(notEmpty)
	};
}

function hydrateFlatNode(node: TFlatNode, cx: TNodeHydrateContext): TResolvedNode | null {
	switch (node.type) {
		case 'link':
			return hydrateLinkNode(node, cx);
		case 'product':
			return hydrateProductNode(node, cx);
		default:
			return resolveFlatNode(node, cx);
	}
}

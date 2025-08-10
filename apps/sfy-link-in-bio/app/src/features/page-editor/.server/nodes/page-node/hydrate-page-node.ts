import { notEmpty } from '@blgc/utils';
import { TFlatNode, TFlatPageNode } from '@repo/editor';
import { resolvePageNodeChild, resolvePageNodeWithoutChildren } from '../../../nodes';
import { TResolvedNode, TResolvedPageNode } from '../../../types';
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
				return hydratePageNodeChild(childNode, {
					site: cx.site,
					parentId: node.id,
					resolved: {
						parentStyles: node.style.children
					}
				});
			})
			.filter(notEmpty)
	};
}

function hydratePageNodeChild(node: TFlatNode, cx: TNodeHydrateContext): TResolvedNode | null {
	switch (node.type) {
		case 'link':
			return hydrateLinkNode(node, cx);
		case 'product':
			return hydrateProductNode(node, cx);
		default:
			return resolvePageNodeChild(node, cx);
	}
}

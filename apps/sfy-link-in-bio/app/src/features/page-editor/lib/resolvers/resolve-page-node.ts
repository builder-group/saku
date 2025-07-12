import { notEmpty } from '@blgc/utils';
import { getBestContrastColor, resolveStyleReference, TNode, TPageNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedNode, TResolvedPageNode } from '../../types';
import { TFlattenedNode } from '../flatten-node';
import { resolveAboutNode } from './resolve-about-node';
import { resolveColor } from './resolve-color';
import { resolveLinkNode } from './resolve-link-node';
import { resolveMediaNode } from './resolve-media-node';
import { resolveProductNode } from './resolve-product-node';
import { resolveTextNode } from './resolve-text-node';

export function resolvePageNode(node: TPageNode, cx: TNodeResolutionContext): TResolvedPageNode {
	return {
		...resolvePageNodeWithoutChildren(node),
		children: node.children
			.map((child) =>
				resolvePageNodeChild(child, { assetsMap: cx.assetsMap, defaultStyles: node.style.children })
			)
			.filter(notEmpty)
	};
}

export function resolvePageNodeWithoutChildren(
	node: TPageNode | TFlattenedNode<TPageNode>
): Omit<TResolvedPageNode, 'children'> {
	return {
		...node,
		style: {
			backgroundColor: resolveColor(node.style.backgroundColor),
			watermarkColor: resolveColor(
				getBestContrastColor(node.style.backgroundColor ?? { r: 255, g: 255, b: 255, a: 1 })
			) as string,
			children: node.style.children
				? {
						backgroundColor: resolveColor(node.style.children.backgroundColor),
						spacing: resolveStyleReference(node.style.children.spacing),
						padding: resolveStyleReference(node.style.children.padding),
						font: resolveStyleReference(node.style.children.font),
						fontSize: resolveStyleReference(node.style.children.fontSize),
						textColor: resolveColor(node.style.children.textColor),
						textAlign: resolveStyleReference(node.style.children.textAlign),
						borderRadius: resolveStyleReference(node.style.children.borderRadius),
						shadow: resolveStyleReference(node.style.children.shadow)
					}
				: undefined
		}
	};
}

function resolvePageNodeChild(node: TNode, cx: TNodeResolutionContext): TResolvedNode | null {
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

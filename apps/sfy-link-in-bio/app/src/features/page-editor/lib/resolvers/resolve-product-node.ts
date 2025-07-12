import { resolveStyleReference, TProductNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedProductNode, TResolvedPromisedNode } from '../../types';
import { resolveColor } from './resolve-color';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedProductNode> {
	const resolvedNode: TResolvedProductNode = {
		...node,
		style: {
			padding: resolveStyleReference(node.style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, cx.defaultStyles?.backgroundColor),
			font: resolveStyleReference(node.style.font, cx.defaultStyles?.font),
			fontSize: resolveStyleReference(node.style.fontSize, cx.defaultStyles?.fontSize),
			textColor: resolveColor(node.style.textColor, cx.defaultStyles?.textColor),
			textAlign: resolveStyleReference(node.style.textAlign, cx.defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(node.style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, cx.defaultStyles?.shadow)
		}
	};

	return {
		type: 'promised',
		id: node.id,
		cached: resolvedNode,
		next: (async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			// TODO: Refetch product data
			resolvedNode.style.backgroundColor = 'red';
			return resolvedNode;
		})()
	};
}

import { resolveStyleReference, TProductNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedProductNode, TResolvedPromisedNode } from '../../types';
import { resolveColor } from './resolve-color';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedProductNode> {
	const { style, ...rest } = node;

	const resolvedNode: TResolvedProductNode = {
		...rest,
		style: {
			padding: resolveStyleReference(style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, cx.defaultStyles?.backgroundColor),
			font: resolveStyleReference(style.font, cx.defaultStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, cx.defaultStyles?.fontSize),
			textColor: resolveColor(style.textColor, cx.defaultStyles?.textColor),
			textAlign: resolveStyleReference(style.textAlign, cx.defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, cx.defaultStyles?.shadow)
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

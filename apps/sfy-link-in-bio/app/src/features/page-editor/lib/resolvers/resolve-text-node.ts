import { resolveStyleReference, TTextNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedTextNode } from '../../types';
import { resolveColor } from './resolve-color';

export function resolveTextNode(node: TTextNode, cx: TNodeResolutionContext): TResolvedTextNode {
	return {
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
}

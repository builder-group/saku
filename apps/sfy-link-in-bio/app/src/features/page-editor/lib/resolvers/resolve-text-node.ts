import { resolveStyleReference, TTextNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedTextNode } from '../../types';
import { resolveColor } from './resolve-color';

export function resolveTextNode(node: TTextNode, cx: TNodeResolutionContext): TResolvedTextNode {
	const { style, ...rest } = node;

	return {
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
}

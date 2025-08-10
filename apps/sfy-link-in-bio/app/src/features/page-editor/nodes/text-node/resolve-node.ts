import { resolveStyleReference, TTextNode } from '@repo/editor';
import { resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedTextNode } from '../../types';

export function resolveTextNode(node: TTextNode, cx: TNodeResolveContext): TResolvedTextNode {
	const { style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

	return {
		...rest,
		style: {
			padding: resolveStyleReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			font: resolveStyleReference(style.font, parentStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, parentStyles?.fontSize),
			textColor: resolveColor(style.textColor, parentStyles?.textColor),
			textAlign: resolveStyleReference(style.textAlign, parentStyles?.textAlign),
			borderRadius: resolveStyleReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, parentStyles?.shadow)
		}
	};
}

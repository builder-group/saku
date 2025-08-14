import { resolveReference, TTextNode } from '@repo/editor';
import { resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedTextNode } from '../../types';

export function resolveTextNode(node: TTextNode, cx: TNodeResolveContext): TResolvedTextNode {
	const { style, ...rest } = node;
	const parentStyles = cx.resolved?.childDefaults;

	return {
		...rest,
		style: {
			padding: resolveReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			font: resolveReference(style.font, parentStyles?.font),
			fontSize: resolveReference(style.fontSize, parentStyles?.fontSize),
			textColor: resolveColor(style.textColor, parentStyles?.textColor),
			textAlign: resolveReference(style.textAlign, parentStyles?.textAlign),
			borderRadius: resolveReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveReference(style.shadow, parentStyles?.shadow)
		}
	};
}

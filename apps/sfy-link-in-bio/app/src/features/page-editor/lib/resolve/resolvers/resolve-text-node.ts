import { resolveStyleReference, TTextNode } from '@repo/editor';
import { TResolvedTextNode } from '../../../types';
import { TNodeResolutionContext } from '../types';
import { resolveColor } from './resolve-color';

export function resolveTextNode(node: TTextNode, cx: TNodeResolutionContext): TResolvedTextNode {
	const { style, ...rest } = node;
	const defaultStyles = cx.resolved?.parentStyles;

	return {
		...rest,
		style: {
			padding: resolveStyleReference(style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyleReference(style.font, defaultStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, defaultStyles?.fontSize),
			textColor: resolveColor(style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyleReference(style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, defaultStyles?.shadow)
		}
	};
}

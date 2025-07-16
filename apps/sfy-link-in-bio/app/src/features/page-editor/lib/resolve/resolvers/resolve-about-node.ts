import { resolveStyleReference, TAboutNode } from '@repo/editor';
import { TResolvedAboutNode } from '../../../types';
import { TNodeResolveContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveAboutNode(node: TAboutNode, cx: TNodeResolveContext): TResolvedAboutNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

	return {
		...rest,
		content: {
			...content,
			profilePicture: resolveAsset(content.profilePicture, cx.site)
		},
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

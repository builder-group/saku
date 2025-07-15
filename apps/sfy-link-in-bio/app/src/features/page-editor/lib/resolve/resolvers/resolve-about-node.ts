import { resolveStyleReference, TAboutNode } from '@repo/editor';
import { TResolvedAboutNode } from '../../../types';
import { TNodeResolutionContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveAboutNode(node: TAboutNode, cx: TNodeResolutionContext): TResolvedAboutNode {
	const { content, style, ...rest } = node;
	const defaultStyles = cx.resolved?.parentStyles;

	return {
		...rest,
		content: {
			...content,
			profilePicture: resolveAsset(content.profilePicture, cx.site)
		},
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

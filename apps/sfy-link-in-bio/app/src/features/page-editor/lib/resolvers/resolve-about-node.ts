import { resolveStyleReference, TAboutNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedAboutNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveAboutNode(node: TAboutNode, cx: TNodeResolutionContext): TResolvedAboutNode {
	const { content, style, ...rest } = node;

	return {
		...rest,
		content: {
			...content,
			profilePicture: resolveAsset(content.profilePicture, cx.assetsMap)
		},
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

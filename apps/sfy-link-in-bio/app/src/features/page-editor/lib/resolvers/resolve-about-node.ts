import { resolveStyleReference, TAboutNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedAboutNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveAboutNode(node: TAboutNode, cx: TNodeResolutionContext): TResolvedAboutNode {
	return {
		...node,
		profilePicture: resolveAsset(node.profilePicture, cx.assetsMap),
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

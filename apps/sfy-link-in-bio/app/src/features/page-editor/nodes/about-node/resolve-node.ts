import { resolveReference, TAboutNode } from '@repo/editor';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedAboutNode } from '../../types';

export function resolveAboutNode(node: TAboutNode, cx: TNodeResolveContext): TResolvedAboutNode {
	const { content, ...rest } = node;
	const parentStyles = cx.resolved?.childDefaults;

	const profilePictureAssetUrl = resolveAsset(content.profilePicture, cx.site);
	return {
		...rest,
		content: {
			...content,
			profilePicture: profilePictureAssetUrl != null ? { url: profilePictureAssetUrl } : undefined
		},
		layout: {
			padding: resolveReference(node.layout.padding, parentStyles?.layout.padding)
		},
		appearance: {
			borderRadius: resolveReference(
				node.appearance?.borderRadius,
				parentStyles?.appearance?.borderRadius
			),
			opacity: resolveReference(node.appearance?.opacity, parentStyles?.appearance?.opacity),
			visible: resolveReference(node.appearance?.visible, parentStyles?.appearance?.visible)
		},
		typography: {
			font: resolveReference(node.typography?.font, parentStyles?.typography?.font),
			fontSize: resolveReference(node.typography?.fontSize, parentStyles?.typography?.fontSize),
			textColor: resolveColor(node.typography?.textColor, parentStyles?.typography?.textColor),
			textAlign: resolveReference(node.typography?.textAlign, parentStyles?.typography?.textAlign),
			lineHeight: resolveReference(
				node.typography?.lineHeight,
				parentStyles?.typography?.lineHeight
			),
			letterSpacing: resolveReference(
				node.typography?.letterSpacing,
				parentStyles?.typography?.letterSpacing
			)
		},
		fill: resolveReference(node.fill, parentStyles?.fill),
		stroke: resolveReference(node.stroke, parentStyles?.stroke),
		shadow: resolveReference(node.shadow, parentStyles?.shadow)
	};
}

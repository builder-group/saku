import { resolveStyleReference, TLinkNode } from '@repo/editor';
import { resolveAsset, resolveColor } from '../../../../lib';
import { TResolvedLinkNode, TResolvedLinkVariant } from '../../../../types';
import { TNodeResolveContext } from '../../types';

export function resolveLinkNode(node: TLinkNode, cx: TNodeResolveContext): TResolvedLinkNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

	let variant: TResolvedLinkVariant;
	switch (content.variant.type) {
		case 'default': {
			variant = {
				type: 'default',
				title: content.variant.userTitle ?? content.variant.title,
				description: content.variant.userDescription ?? content.variant.description,
				favicon: resolveAsset(content.variant.userFavicon ?? content.variant.favicon, cx.site)
			};
			break;
		}
		case 'youtube-video': {
			variant = {
				type: 'youtube-video',
				title: content.variant.userTitle ?? content.variant.title
			};
			break;
		}
		case 'youtube-channel': {
			variant = {
				type: 'youtube-channel',
				title: content.variant.userTitle ?? content.variant.title
			};
			break;
		}
		case 'youtube-video-embed': {
			variant = {
				type: 'youtube-video-embed',
				videoId: content.variant.videoId
			};
			break;
		}
	}

	return {
		...rest,
		content: {
			url: content.url,
			variant
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

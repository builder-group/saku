import { resolveReference, TLinkNode } from '@repo/editor';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedLinkNode, TResolvedLinkVariant } from '../../types';

export function resolveLinkNode(node: TLinkNode, cx: TNodeResolveContext): TResolvedLinkNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.childDefaults;

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
		// case 'youtube-video': {
		// 	variant = {
		// 		type: 'youtube-video',
		// 		title: content.variant.userTitle ?? content.variant.title
		// 	};
		// 	break;
		// }
		// case 'youtube-channel': {
		// 	variant = {
		// 		type: 'youtube-channel',
		// 		title: content.variant.userTitle ?? content.variant.title
		// 	};
		// 	break;
		// }
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

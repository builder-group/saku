import { TLinkNode } from '@repo/editor';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin
} from '../../mixins';
import { TResolvedLinkNode, TResolvedLinkVariant } from './types';

export function resolveLinkNode(node: TLinkNode, cx: TNodeResolveContext): TResolvedLinkNode {
	const { content, layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

	let variant: TResolvedLinkVariant;
	switch (content.variant.type) {
		case 'default': {
			const favicon = content.variant.userFavicon ?? content.variant.favicon;
			variant = {
				type: 'default',
				title: content.variant.userTitle ?? content.variant.title,
				description: content.variant.userDescription ?? content.variant.description,
				favicon: favicon != null ? resolveAsset(favicon, cx.site) : undefined
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
		layout: resolveLayoutStyleMixin(layout, cx.childMixins?.layout),
		appearance: resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance),
		typography: resolveTypographyStyleMixin(typography, cx.childMixins?.typography),
		fill: resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill),
		stroke: resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke),
		shadow: resolveShadowStyleMixin(shadow, cx.childMixins?.shadow)
	};
}

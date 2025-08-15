import { TMediaNode } from '@repo/editor';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin
} from '../../mixins';
import { TResolvedMedia, TResolvedMediaNode } from './types';

export function resolveMediaNode(node: TMediaNode, cx: TNodeResolveContext): TResolvedMediaNode {
	const { content, layout, appearance, fill, stroke, shadow, ...rest } = node;

	let media: TResolvedMedia | undefined;
	switch (content.media?.type) {
		case 'image': {
			const assetUrl = resolveAsset(content.media.hash, cx.site);
			if (assetUrl != null) {
				media = {
					...content.media,
					url: assetUrl
				};
			}
			break;
		}
		default:
		// do nothing
	}

	return {
		...rest,
		content: {
			media
		},
		layout: resolveLayoutStyleMixin(layout, cx.childMixins?.layout),
		appearance: resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance),
		fill: resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill),
		stroke: resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke),
		shadow: resolveShadowStyleMixin(shadow, cx.childMixins?.shadow)
	};
}

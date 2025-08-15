import { TAboutNode } from '@repo/editor';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin
} from '../../mixins';
import { TResolvedAboutNode } from './types';

export function resolveAboutNode(node: TAboutNode, cx: TNodeResolveContext): TResolvedAboutNode {
	const { content, layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

	return {
		...rest,
		content: {
			...content,
			profilePicture:
				content.profilePicture != null ? resolveAsset(content.profilePicture, cx.site) : undefined
		},
		layout: resolveLayoutStyleMixin(layout, cx.childMixins?.layout),
		appearance: resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance),
		typography: resolveTypographyStyleMixin(typography, cx.childMixins?.typography),
		fill: resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill),
		stroke: resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke),
		shadow: resolveShadowStyleMixin(shadow, cx.childMixins?.shadow)
	};
}

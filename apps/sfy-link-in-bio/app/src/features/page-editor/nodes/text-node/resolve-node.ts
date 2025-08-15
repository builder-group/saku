import { TTextNode } from '@repo/editor';
import { TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin
} from '../../mixins';
import { TResolvedTextNode } from './types';

export function resolveTextNode(node: TTextNode, cx: TNodeResolveContext): TResolvedTextNode {
	const { layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

	return {
		...rest,
		layout: resolveLayoutStyleMixin(layout, cx.childMixins?.layout),
		appearance: resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance),
		typography: resolveTypographyStyleMixin(typography, cx.childMixins?.typography),
		fill: resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill),
		stroke: resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke),
		shadow: resolveShadowStyleMixin(shadow, cx.childMixins?.shadow)
	};
}

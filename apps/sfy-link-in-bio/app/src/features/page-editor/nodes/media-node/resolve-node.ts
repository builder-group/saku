import { TMediaNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin
} from '../../mixins';
import { TResolvedMedia, TResolvedMediaNode } from './types';

export function resolveMediaNode(
	node: TMediaNode,
	cx: TNodeResolveContext
): TResult<TResolvedMediaNode, AppError> {
	const { content, layout, appearance, fill, stroke, shadow, ...rest } = node;

	let resolvedMedia: TResolvedMedia | undefined;
	switch (content.media?.type) {
		case 'image': {
			const resolvedAsset = resolveAsset(content.media.hash, cx.site);
			if (resolvedAsset != null) {
				resolvedMedia = {
					...content.media,
					src: resolvedAsset.src
				};
			}
			break;
		}
		default:
		// do nothing
	}

	const [isResolvedLayoutOk, resolvedLayoutErr, resolvedLayout] = resolveLayoutStyleMixin(
		layout,
		cx.childMixins?.layout
	);
	if (!isResolvedLayoutOk) {
		return Err(resolvedLayoutErr.wrapWith('#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		fill,
		cx.site,
		cx.childMixins?.fill
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		stroke,
		cx.childMixins?.stroke
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		shadow,
		cx.childMixins?.shadow
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			media: resolvedMedia
		},
		layout: resolvedLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow
	});
}

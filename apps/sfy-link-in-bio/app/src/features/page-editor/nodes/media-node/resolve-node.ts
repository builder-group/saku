import { Err, Ok, TResult } from '@blgc/utils';
import { TMediaNode } from '@repo/editor';
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
			const assetUrl = resolveAsset(content.media.hash, cx.site);
			if (assetUrl != null) {
				resolvedMedia = {
					...content.media,
					url: assetUrl
				};
			}
			break;
		}
		default:
		// do nothing
	}

	const resolveLayoutResult = resolveLayoutStyleMixin(layout, cx.childMixins?.layout);
	if (resolveLayoutResult.isErr()) {
		return Err(AppError.wrap(resolveLayoutResult.error, '#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const resolveAppearanceResult = resolveAppearanceStyleMixin(
		appearance,
		cx.childMixins?.appearance
	);
	if (resolveAppearanceResult.isErr()) {
		return Err(AppError.wrap(resolveAppearanceResult.error, '#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const resolveFillResult = resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill);
	if (resolveFillResult.isErr()) {
		return Err(AppError.wrap(resolveFillResult.error, '#ERR_RESOLVE_FILL_STYLE'));
	}
	const resolveStrokeResult = resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke);
	if (resolveStrokeResult.isErr()) {
		return Err(AppError.wrap(resolveStrokeResult.error, '#ERR_RESOLVE_STROKE_STYLE'));
	}
	const resolveShadowResult = resolveShadowStyleMixin(shadow, cx.childMixins?.shadow);
	if (resolveShadowResult.isErr()) {
		return Err(AppError.wrap(resolveShadowResult.error, '#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			media: resolvedMedia
		},
		layout: resolveLayoutResult.value,
		appearance: resolveAppearanceResult.value,
		fill: resolveFillResult.value,
		stroke: resolveStrokeResult.value,
		shadow: resolveShadowResult.value
	});
}

import { TTextNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
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

export function resolveTextNode(
	node: TTextNode,
	cx: TNodeResolveContext
): TResult<TResolvedTextNode, AppError> {
	const { layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

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
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin(typography, cx.childMixins?.typography);
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
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
		layout: resolvedLayout,
		appearance: resolvedAppearance,
		typography: resolvedTypography,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow
	});
}

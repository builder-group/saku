import { TButtonStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	TResolveAppearanceStyleMixinParentMixin
} from '../appearance-style';
import { resolveFillStyleMixin, TResolveFillStyleMixinParentMixin } from '../fill-style';
import { resolveShadowStyleMixin, TResolveShadowStyleMixinParentMixin } from '../shadow-style';
import { resolveStrokeStyleMixin, TResolveStrokeStyleMixinParentMixin } from '../stroke-style';
import { resolveTextStyleMixin, TResolveTextStyleMixinParentMixin } from '../text-style';
import { TResolvedButtonStyleMixin } from './types';

export function resolveButtonStyleMixin(
	button: TButtonStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedButtonStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(button.appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(button.fill, cx);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		button.stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		button.shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(button.text, cx);
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText
	});
}

export interface TResolveCtaStyleMixinParentMixin {
	appearance: TResolveAppearanceStyleMixinParentMixin;
	fill: TResolveFillStyleMixinParentMixin;
	stroke: TResolveStrokeStyleMixinParentMixin;
	shadow: TResolveShadowStyleMixinParentMixin;
	text: TResolveTextStyleMixinParentMixin;
}

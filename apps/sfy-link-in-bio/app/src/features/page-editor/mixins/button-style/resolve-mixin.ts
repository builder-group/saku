import { TButtonStyleMixin, TButtonStyleToken, TTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	TResolveAppearanceStyleMixinParentMixin
} from '../appearance-style';
import { resolveFillStyleMixin, TResolveFillStyleMixinParentMixin } from '../fill-style';
import { resolveShadowStyleMixin, TResolveShadowStyleMixinParentMixin } from '../shadow-style';
import { resolveStrokeStyleMixin, TResolveStrokeStyleMixinParentMixin } from '../stroke-style';
import { resolveTextStyleMixin, TResolveTextStyleMixinParentMixin } from '../text-style';
import { TResolvedButtonStyleMixin } from './types';

export function resolveButtonStyleMixin<GTokenSet extends TTokenSet>(
	button: TButtonStyleMixin['value'],
	cx: TMixinResolveContext<TButtonStyleToken['value'], GTokenSet>
): TResult<TResolvedButtonStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(button.appearance, {
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.appearance
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(button.fill, {
		...cx,
		mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.fill
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		button.stroke,
		{
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.stroke
		}
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		button.shadow,
		{
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.shadow
		}
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(button.text, {
		...cx,
		mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.text
	});
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

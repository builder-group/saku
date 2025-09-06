import { TButtonStyleMixin, TButtonStyleToken, TMixinTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveFillStyleMixin } from '../fill-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { resolveTextStyleMixin } from '../text-style';
import { TResolvedButtonStyleMixin } from './types';

export function resolveButtonStyleMixin<GTokenSet extends TMixinTokenSet>(
	button: TButtonStyleMixin['value'],
	cx: TMixinResolveContext<TButtonStyleToken['value'], GTokenSet>
): TResult<TResolvedButtonStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(button.appearance, {
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.appearance
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(button.fill, {
		...cx,
		mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.fill
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		button.stroke,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.stroke
		}
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		button.shadow,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.shadow
		}
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(button.text, {
		...cx,
		mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.text
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText,
		styles: {
			...resolvedAppearance.styles,
			...resolvedFill?.styles,
			...resolvedStroke?.styles,
			...resolvedShadow?.styles
		}
	});
}

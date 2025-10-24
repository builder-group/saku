import { resolveTokenRef, TBannerStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveFillStyleMixin } from '../fill-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { resolveTextStyleMixin } from '../text-style';
import { TResolvedBannerStyleMixin } from './types';

export function resolveBannerStyleMixin(
	banner: TBannerStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBannerStyleMixin['value'], AppError> {
	const [isResolvedBannerOk, resolvedBannerErr, resolvedBanner] = resolveTokenRef(banner, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedBannerOk) {
		return Err(AppError.fromEditorError(resolvedBannerErr).wrapWith('#ERR_RESOLVE_BADGE_STYLE'));
	}

	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(resolvedBanner.appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		resolvedBanner.fill,
		cx
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		resolvedBanner.stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		resolvedBanner.shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(
		resolvedBanner.text,
		cx
	);
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

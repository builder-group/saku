import { TMixinTokenSet, TProductDetailsStyleMixin, TProductDetailsStyleToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveButtonStyleMixin } from '../button-style';
import { resolveFillStyleMixin } from '../fill-style';
import { resolveImageStyleMixin } from '../image-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { resolveTextStyleMixin } from '../text-style';
import { TResolvedProductDetailsStyleMixin } from './types';

export function resolveProductDetailsStyleMixin<GTokenSet extends TMixinTokenSet>(
	productDetails: TProductDetailsStyleMixin['value'],
	cx: TMixinResolveContext<TProductDetailsStyleToken['value'], GTokenSet>
): TResult<TResolvedProductDetailsStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(productDetails.appearance, {
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.appearance
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		productDetails.fill,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.fill
		}
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		productDetails.stroke,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.stroke
		}
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		productDetails.shadow,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.shadow
		}
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedXlTextOk, resolvedXlTextErr, resolvedXlText] = resolveTextStyleMixin(
		productDetails.textXl,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.textXl
		}
	);
	if (!isResolvedXlTextOk) {
		return Err(resolvedXlTextErr.wrapWith('#ERR_RESOLVE_XL_TEXT_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(
		productDetails.text,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.text
		}
	);
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedPrimaryButtonOk, resolvedPrimaryButtonErr, resolvedPrimaryButton] =
		resolveButtonStyleMixin(productDetails.buttonPrimary, {
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.buttonPrimary
		});
	if (!isResolvedPrimaryButtonOk) {
		return Err(resolvedPrimaryButtonErr.wrapWith('#ERR_RESOLVE_PRIMARY_BUTTON_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(
		productDetails.image,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.image
		}
	);
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		textXl: resolvedXlText,
		text: resolvedText,
		buttonPrimary: resolvedPrimaryButton,
		image: resolvedImage,
		styles: {
			...resolvedAppearance.styles,
			...resolvedFill?.styles,
			...resolvedStroke?.styles,
			...resolvedShadow?.styles
		}
	});
}

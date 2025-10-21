import { resolveTokenRef, TProductDetailsStyleMixin } from '@repo/editor';
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

export function resolveProductDetailsStyleMixin(
	productDetails: TProductDetailsStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedProductDetailsStyleMixin['value'], AppError> {
	const [isResolvedProductDetailsOk, resolvedProductDetailsErr, resolvedProductDetails] =
		resolveTokenRef(productDetails, {
			tokenMap: cx.tokenMap
		});
	if (!isResolvedProductDetailsOk) {
		return Err(
			AppError.fromEditorError(resolvedProductDetailsErr).wrapWith(
				'#ERR_RESOLVE_PRODUCT_DETAILS_STYLE'
			)
		);
	}

	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(resolvedProductDetails.appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		resolvedProductDetails.fill,
		cx
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		resolvedProductDetails.stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		resolvedProductDetails.shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextHeadingOk, resolvedTextHeadingErr, resolvedTextHeading] =
		resolveTextStyleMixin(resolvedProductDetails.textHeading, cx);
	if (!isResolvedTextHeadingOk) {
		return Err(resolvedTextHeadingErr.wrapWith('#ERR_RESOLVE_TEXT_TITLE_STYLE'));
	}
	const [isResolvedTextBodyOk, resolvedTextBodyErr, resolvedTextBody] = resolveTextStyleMixin(
		resolvedProductDetails.textBody,
		cx
	);
	if (!isResolvedTextBodyOk) {
		return Err(resolvedTextBodyErr.wrapWith('#ERR_RESOLVE_TEXT_BODY_STYLE'));
	}
	const [isResolvedButtonPrimaryOk, resolvedButtonPrimaryErr, resolvedButtonPrimary] =
		resolveButtonStyleMixin(resolvedProductDetails.buttonPrimary, cx);
	if (!isResolvedButtonPrimaryOk) {
		return Err(resolvedButtonPrimaryErr.wrapWith('#ERR_RESOLVE_BUTTON_PRIMARY_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(
		resolvedProductDetails.image,
		cx
	);
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		textHeading: resolvedTextHeading,
		textBody: resolvedTextBody,
		buttonPrimary: resolvedButtonPrimary,
		image: resolvedImage,
		styles: {
			...resolvedAppearance.styles,
			...resolvedFill?.styles,
			...resolvedStroke?.styles,
			...resolvedShadow?.styles
		}
	});
}

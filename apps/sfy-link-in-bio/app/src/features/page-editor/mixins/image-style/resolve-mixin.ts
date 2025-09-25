import { TImageStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { TResolvedImageStyleMixin } from './types';

export function resolveImageStyleMixin(
	image: TImageStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedImageStyleMixin['value'], AppError> {
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveTokenRef(image, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(resolvedImage.appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		resolvedImage.stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		resolvedImage.shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		styles: {
			...resolvedAppearance.styles,
			...resolvedStroke?.styles,
			...resolvedShadow?.styles
		}
	});
}

import { TTextStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveFillStyleMixin } from '../fill-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { resolveTypographyStyleMixin } from '../typography-style';
import { TResolvedTextStyleMixin } from './types';

export function resolveTextStyleMixin(
	text: TTextStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedTextStyleMixin['value'], AppError> {
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTokenRef(text, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}

	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(resolvedText.appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin(resolvedText.typography, cx);
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		resolvedText.fill,
		cx
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		resolvedText.stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		resolvedText.shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		typography: resolvedTypography,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		styles: {
			...resolvedAppearance.styles,
			...resolvedTypography.styles,
			color: resolvedFill?.paint.type === 'solid' ? resolvedFill?.paint.color : undefined,
			WebkitTextStroke: resolvedStroke?.width
				? `${resolvedStroke.width}px ${resolvedStroke.color}`
				: undefined,
			textShadow:
				resolvedShadow != null
					? `${resolvedShadow.offsetX}px ${resolvedShadow.offsetY}px ${resolvedShadow.blur}px ${resolvedShadow.color}`
					: undefined
		}
	});
}

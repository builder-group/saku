import { TTextStyleMixin, TTextStyleToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveFillStyleMixin } from '../fill-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { resolveTypographyStyleMixin } from '../typography-style';
import { TResolvedTextStyleMixin } from './types';

export function resolveTextStyleMixin<GBaseValue>(
	text: TTextStyleMixin['value'],
	cx: TMixinResolveContext<TTextStyleToken['value'], GBaseValue>
): TResult<TResolvedTextStyleMixin['value'], AppError> {
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTokenRef(text, {
		tokenMap: cx.tokenMap,
		expectedType: 'text',
		mapToTokenValue: cx.mapToTokenValue
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}

	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin<GBaseValue>(resolvedText.appearance, {
			...cx,
			mapToTokenValue: (value) => cx.mapToTokenValue(value)?.appearance
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin<GBaseValue>(resolvedText.typography, {
			...cx,
			mapToTokenValue: (value) => cx.mapToTokenValue(value)?.typography
		});
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin<GBaseValue>(
		resolvedText.fill,
		{
			...cx,
			mapToTokenValue: (value) => cx.mapToTokenValue(value)?.fill
		}
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] =
		resolveStrokeStyleMixin<GBaseValue>(resolvedText.stroke, {
			...cx,
			mapToTokenValue: (value) => cx.mapToTokenValue(value)?.stroke
		});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] =
		resolveShadowStyleMixin<GBaseValue>(resolvedText.shadow, {
			...cx,
			mapToTokenValue: (value) => cx.mapToTokenValue(value)?.shadow
		});
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

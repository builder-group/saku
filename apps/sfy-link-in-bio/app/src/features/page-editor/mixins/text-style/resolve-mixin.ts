import { TTextStyleMixin, TTextStyleToken, TToken } from '@repo/editor';
import { Err, Ok, TResult, unwrapOrNull } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveFillStyleMixin } from '../fill-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { resolveTypographyStyleMixin } from '../typography-style';
import { TResolvedTextStyleMixin } from './types';

export function resolveTextStyleMixin<GBaseTokenValue extends TToken['value']>(
	text: TTextStyleMixin['value'],
	cx: TMixinResolveContext<TTextStyleToken['value'], GBaseTokenValue>
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
		resolveAppearanceStyleMixin<GBaseTokenValue>(resolvedText.appearance, {
			...cx,
			mapToTokenValue: (value) => {
				const tokenValue = cx.mapToTokenValue(value)?.appearance;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'appearance'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin<GBaseTokenValue>(resolvedText.typography, {
			...cx,
			mapToTokenValue: (value) => {
				const tokenValue = cx.mapToTokenValue(value)?.typography;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'typography'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
		});
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin<GBaseTokenValue>(
		resolvedText.fill,
		{
			...cx,
			mapToTokenValue: (value) => {
				const tokenValue = cx.mapToTokenValue(value)?.fill;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'fill'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
		}
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] =
		resolveStrokeStyleMixin<GBaseTokenValue>(resolvedText.stroke, {
			...cx,
			mapToTokenValue: (value) => {
				const tokenValue = cx.mapToTokenValue(value)?.stroke;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'stroke'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
		});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] =
		resolveShadowStyleMixin<GBaseTokenValue>(resolvedText.shadow, {
			...cx,
			mapToTokenValue: (value) => {
				const tokenValue = cx.mapToTokenValue(value)?.shadow;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'shadow'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
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

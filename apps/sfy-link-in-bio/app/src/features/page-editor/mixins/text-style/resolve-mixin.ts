import { TMixinTokenSet, TTextStyleMixin, TTextStyleToken } from '@repo/editor';
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
import {
	resolveTypographyStyleMixin,
	TResolveTypographyStyleMixinParentMixin
} from '../typography-style';
import { TResolvedTextStyleMixin } from './types';

export function resolveTextStyleMixin<GTokenSet extends TMixinTokenSet>(
	text: TTextStyleMixin['value'],
	cx: TMixinResolveContext<TTextStyleToken['value'], GTokenSet>
): TResult<TResolvedTextStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(text.appearance, {
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.appearance
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin(text.typography, {
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.typography
		});
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(text.fill, {
		...cx,
		mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.fill
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		text.stroke,
		{
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.stroke
		}
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		text.shadow,
		{
			...cx,
			mapToToken: (ref, tokenSet) => cx.mapToToken(ref, tokenSet)?.shadow
		}
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

export interface TResolveTextStyleMixinParentMixin {
	appearance: TResolveAppearanceStyleMixinParentMixin;
	typography: TResolveTypographyStyleMixinParentMixin;
	fill: TResolveFillStyleMixinParentMixin;
	stroke: TResolveStrokeStyleMixinParentMixin;
	shadow: TResolveShadowStyleMixinParentMixin;
}

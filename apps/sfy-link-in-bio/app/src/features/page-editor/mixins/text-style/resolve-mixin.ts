import { TAsset, TAssetHash, TTextStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
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

export function resolveTextStyleMixin(
	text: TTextStyleMixin['value'],
	context: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	},
	parentMixin?: TResolveTextStyleMixinParentMixin
): TResult<TResolvedTextStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(text.appearance, parentMixin?.appearance);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin(text.typography, parentMixin?.typography);
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		text.fill,
		context,
		parentMixin?.fill
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		text.stroke,
		parentMixin?.stroke
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		text.shadow,
		parentMixin?.shadow
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
			visibility: resolvedAppearance.visible ? 'visible' : 'hidden',
			opacity: `${resolvedAppearance.opacity * 100}%`,
			color: resolvedFill?.paint.type === 'solid' ? resolvedFill?.paint.color : undefined,
			WebkitTextStroke: resolvedStroke?.width
				? `${resolvedStroke.width}px ${resolvedStroke.color}`
				: undefined,
			textShadow: resolvedShadow?.offsetX
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

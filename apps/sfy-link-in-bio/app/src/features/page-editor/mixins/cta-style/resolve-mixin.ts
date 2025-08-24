import { TAsset, TAssetHash, TCtaStyleMixin } from '@repo/editor';
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
import { TResolvedCtaStyleMixin } from './types';

export function resolveCtaStyleMixin(
	cta: TCtaStyleMixin['value'],
	context: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	},
	parentMixin?: TResolveCtaStyleMixinParentMixin
): TResult<TResolvedCtaStyleMixin['value'], AppError> {
	const [isAppearanceOk, appearanceErr, appearance] = resolveAppearanceStyleMixin(
		cta.appearance,
		parentMixin?.appearance
	);
	if (!isAppearanceOk) {
		return Err(appearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isTypographyOk, typographyErr, typography] = resolveTypographyStyleMixin(
		cta.typography,
		parentMixin?.typography
	);
	if (!isTypographyOk) {
		return Err(typographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isFillOk, fillErr, fill] = resolveFillStyleMixin(cta.fill, context, parentMixin?.fill);
	if (!isFillOk) {
		return Err(fillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isStrokeOk, strokeErr, stroke] = resolveStrokeStyleMixin(cta.stroke, parentMixin?.stroke);
	if (!isStrokeOk) {
		return Err(strokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isShadowOk, shadowErr, shadow] = resolveShadowStyleMixin(cta.shadow, parentMixin?.shadow);
	if (!isShadowOk) {
		return Err(shadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		appearance,
		typography,
		fill,
		stroke,
		shadow
	});
}

export interface TResolveCtaStyleMixinParentMixin {
	appearance: TResolveAppearanceStyleMixinParentMixin;
	typography: TResolveTypographyStyleMixinParentMixin;
	fill: TResolveFillStyleMixinParentMixin;
	stroke: TResolveStrokeStyleMixinParentMixin;
	shadow: TResolveShadowStyleMixinParentMixin;
}

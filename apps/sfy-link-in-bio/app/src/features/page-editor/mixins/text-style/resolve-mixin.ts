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
	const [isAppearanceOk, appearanceErr, appearance] = resolveAppearanceStyleMixin(
		text.appearance,
		parentMixin?.appearance
	);
	if (!isAppearanceOk) {
		return Err(appearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isTypographyOk, typographyErr, typography] = resolveTypographyStyleMixin(
		text.typography,
		parentMixin?.typography
	);
	if (!isTypographyOk) {
		return Err(typographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isFillOk, fillErr, fill] = resolveFillStyleMixin(text.fill, context, parentMixin?.fill);
	if (!isFillOk) {
		return Err(fillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isStrokeOk, strokeErr, stroke] = resolveStrokeStyleMixin(text.stroke, parentMixin?.stroke);
	if (!isStrokeOk) {
		return Err(strokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isShadowOk, shadowErr, shadow] = resolveShadowStyleMixin(text.shadow, parentMixin?.shadow);
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

export interface TResolveTextStyleMixinParentMixin {
	appearance: TResolveAppearanceStyleMixinParentMixin;
	typography: TResolveTypographyStyleMixinParentMixin;
	fill: TResolveFillStyleMixinParentMixin;
	stroke: TResolveStrokeStyleMixinParentMixin;
	shadow: TResolveShadowStyleMixinParentMixin;
}

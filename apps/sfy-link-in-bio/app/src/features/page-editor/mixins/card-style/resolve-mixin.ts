import { TAsset, TAssetHash, TCardStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import {
	resolveAppearanceStyleMixin,
	TResolveAppearanceStyleMixinParentMixin
} from '../appearance-style';
import { resolveFillStyleMixin, TResolveFillStyleMixinParentMixin } from '../fill-style';
import { resolveLayoutStyleMixin, TResolveLayoutStyleMixinParentMixin } from '../layout-style';
import { resolveShadowStyleMixin, TResolveShadowStyleMixinParentMixin } from '../shadow-style';
import { resolveStrokeStyleMixin, TResolveStrokeStyleMixinParentMixin } from '../stroke-style';
import { TResolvedCardStyleMixin } from './types';

export function resolveCardStyleMixin(
	card: TCardStyleMixin['value'],
	context: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	},
	parentMixin?: TResolveCardStyleMixinParentMixin
): TResult<TResolvedCardStyleMixin['value'], AppError> {
	const [isLayoutOk, layoutErr, layout] = resolveLayoutStyleMixin(card.layout, parentMixin?.layout);
	if (!isLayoutOk) {
		return Err(layoutErr.wrapWith('#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const [isAppearanceOk, appearanceErr, appearance] = resolveAppearanceStyleMixin(
		card.appearance,
		parentMixin?.appearance
	);
	if (!isAppearanceOk) {
		return Err(appearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isFillOk, fillErr, fill] = resolveFillStyleMixin(card.fill, context, parentMixin?.fill);
	if (!isFillOk) {
		return Err(fillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isStrokeOk, strokeErr, stroke] = resolveStrokeStyleMixin(card.stroke, parentMixin?.stroke);
	if (!isStrokeOk) {
		return Err(strokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isShadowOk, shadowErr, shadow] = resolveShadowStyleMixin(card.shadow, parentMixin?.shadow);
	if (!isShadowOk) {
		return Err(shadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		layout,
		appearance,
		fill,
		stroke,
		shadow
	});
}

export interface TResolveCardStyleMixinParentMixin {
	layout: TResolveLayoutStyleMixinParentMixin;
	appearance: TResolveAppearanceStyleMixinParentMixin;
	fill: TResolveFillStyleMixinParentMixin;
	stroke: TResolveStrokeStyleMixinParentMixin;
	shadow: TResolveShadowStyleMixinParentMixin;
}

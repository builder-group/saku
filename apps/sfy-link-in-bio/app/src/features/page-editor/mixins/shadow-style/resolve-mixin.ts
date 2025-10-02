import { resolveTokenRef, TShadowStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveSolidPaint, TMixinResolveContext } from '../../lib';
import { TResolvedShadowStyleMixin } from './types';

export function resolveShadowStyleMixin(
	shadow: TShadowStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedShadowStyleMixin['value'], AppError> {
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveTokenRef(shadow, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedShadowOk) {
		return Err(AppError.fromEditorError(resolvedShadowErr).wrapWith('#ERR_RESOLVE_SHADOW'));
	}
	if (resolvedShadow == null) {
		return Ok(null);
	}

	const [isResolvedPaintOk, resolvedPaintErr, paint] = resolveTokenRef(resolvedShadow.paint, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedPaintOk) {
		return Err(AppError.fromEditorError(resolvedPaintErr).wrapWith('#ERR_RESOLVE_PAINT'));
	}
	const resolvedPaint = resolveSolidPaint(paint);
	const [isResolvedOffsetXOk, resolvedOffsetXErr, resolvedOffsetX] = resolveTokenRef(
		resolvedShadow.offsetX,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedOffsetXOk) {
		return Err(AppError.fromEditorError(resolvedOffsetXErr).wrapWith('#ERR_RESOLVE_OFFSET_X'));
	}
	const [isResolvedOffsetYOk, resolvedOffsetYErr, resolvedOffsetY] = resolveTokenRef(
		resolvedShadow.offsetY,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedOffsetYOk) {
		return Err(AppError.fromEditorError(resolvedOffsetYErr).wrapWith('#ERR_RESOLVE_OFFSET_Y'));
	}
	const [isResolvedBlurOk, resolvedBlurErr, resolvedBlur] = resolveTokenRef(resolvedShadow.blur, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedBlurOk) {
		return Err(AppError.fromEditorError(resolvedBlurErr).wrapWith('#ERR_RESOLVE_BLUR'));
	}
	const [isResolvedSpreadOk, resolvedSpreadErr, resolvedSpread] = resolveTokenRef(
		resolvedShadow.spread,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedSpreadOk) {
		return Err(AppError.fromEditorError(resolvedSpreadErr).wrapWith('#ERR_RESOLVE_SPREAD'));
	}

	return Ok({
		paint: resolvedPaint,
		offsetX: resolvedOffsetX,
		offsetY: resolvedOffsetY,
		blur: resolvedBlur,
		spread: resolvedSpread,
		styles: {
			boxShadow: `${resolvedOffsetX}px ${resolvedOffsetY}px ${resolvedBlur}px ${resolvedSpread}px ${resolvedPaint.color}`
		}
	});
}

import { resolveTokenRef, TStrokeStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveSolidPaint, TMixinResolveContext } from '../../lib';
import { TResolvedStrokeStyleMixin } from './types';

export function resolveStrokeStyleMixin(
	stroke: TStrokeStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedStrokeStyleMixin['value'], AppError> {
	const [isResolvedStorkeOk, resolvedStorkeErr, resolvedStroke] = resolveTokenRef(stroke, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedStorkeOk) {
		return Err(AppError.fromEditorError(resolvedStorkeErr).wrapWith('#ERR_RESOLVE_STROKE'));
	}
	if (resolvedStroke == null) {
		return Ok(null);
	}

	const [isResolvedPaintOk, resolvedPaintErr, paint] = resolveTokenRef(resolvedStroke.paint, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedPaintOk) {
		return Err(AppError.fromEditorError(resolvedPaintErr).wrapWith('#ERR_RESOLVE_PAINT'));
	}
	const resolvedPaint = resolveSolidPaint(paint);
	const [isResolvedWidthOk, resolvedWidthErr, resolvedWidth] = resolveTokenRef(
		resolvedStroke.width,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedWidthOk) {
		return Err(AppError.fromEditorError(resolvedWidthErr).wrapWith('#ERR_RESOLVE_WIDTH'));
	}

	return Ok({
		width: resolvedWidth,
		paint: resolvedPaint,
		styles: {
			border: `${resolvedWidth}px solid ${resolvedPaint.color}`
		}
	});
}

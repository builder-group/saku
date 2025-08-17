import { resolveReference, TAsset, TAssetHash, TFillStyleMixin, TPaint } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolvePaint } from '../../lib';
import { TResolvedFillStyleMixin } from './types';

export function resolveFillStyleMixin(
	fill: TFillStyleMixin['value'],
	context: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	},
	parentMixin?: {
		paint: TPaint;
		opacity: number;
	} | null
): TResult<TResolvedFillStyleMixin['value'], AppError> {
	const resolvedFill = resolveReference(fill, parentMixin);
	if (resolvedFill == null) {
		return Ok(null);
	}

	const resolvedPaint = resolvePaint(resolvedFill.paint, context);
	if (resolvedPaint == null) {
		return Err(new AppError('#ERR_RESOLVE_PAINT'));
	}

	return Ok({
		paint: resolvedPaint,
		opacity: resolvedFill.opacity
	});
}

import { resolveReference, TAsset, TAssetHash, TFillStyleMixin, TPaint } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
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

	return Ok({
		paint: resolvePaint(resolvedFill.paint, context)
	});
}

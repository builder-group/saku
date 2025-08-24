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
	parentMixin?: TResolveFillStyleMixinParentMixin
): TResult<TResolvedFillStyleMixin['value'], AppError> {
	const resolvedFill = resolveReference(fill, parentMixin);
	if (resolvedFill == null) {
		return Ok(null);
	}

	const resolvedPaint = resolvePaint(resolvedFill.paint, context);

	const styles: {
		backgroundColor?: string;
		backgroundImage?: string;
		backgroundSize?: string;
		backgroundPosition?: string;
		backgroundRepeat?: string;
	} = {};
	switch (resolvedPaint.type) {
		case 'solid': {
			styles.backgroundColor = resolvedPaint.color;
			break;
		}
		case 'image': {
			if (resolvedPaint.src != null) {
				styles.backgroundImage = `url(${resolvedPaint.src})`;
				styles.backgroundSize = 'cover';
				styles.backgroundPosition = 'center top';
				styles.backgroundRepeat = 'no-repeat';
			}
			break;
		}
	}

	return Ok({
		paint: resolvedPaint,
		styles
	});
}

export type TResolveFillStyleMixinParentMixin = {
	paint: TPaint;
	opacity: number;
} | null;

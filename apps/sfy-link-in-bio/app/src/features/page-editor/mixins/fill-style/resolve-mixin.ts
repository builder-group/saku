import { resolveReference, TAsset, TAssetHash, TFillStyleMixin, TPaint } from '@repo/editor';
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
): TResolvedFillStyleMixin['value'] {
	if (parentMixin == null) {
		return undefined;
	}

	const resolvedFill = resolveReference(fill, parentMixin);
	if (resolvedFill == null) {
		return undefined;
	}

	const resolvedPaint = resolvePaint(resolvedFill.paint, context);
	if (resolvedPaint == null) {
		return undefined;
	}

	return {
		paint: resolvedPaint,
		opacity: resolvedFill.opacity
	};
}

import {
	resolveReference,
	TAsset,
	TAssetHash,
	TFillStyleMixin,
	TMixin,
	TPaint
} from '@repo/editor';
import { resolvePaint, TResolvedPaint } from './resolve-paint';

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

export type TResolvedFillStyleMixin = TMixin<
	'fill',
	| {
			paint: TResolvedPaint;
			opacity: number;
	  }
	| undefined
>;

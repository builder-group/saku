import { TAsset, TAssetHash, TImagePaint, TPaint, TSolidPaint } from '@repo/editor';
import { resolveAsset } from './resolve-asset';
import { resolveColor, TResolvedColor } from './resolve-color';

export function resolvePaint(
	paint: TPaint,
	cx: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	}
): TResolvedPaint {
	switch (paint.type) {
		case 'solid':
			return resolveSolidPaint(paint);
		case 'image':
			return resolveImagePaint(paint, cx);
	}
}

export type TResolvedPaint = TResolvedSolidPaint | TResolvedImagePaint;

export function resolveSolidPaint(paint: TSolidPaint): TResolvedSolidPaint {
	return {
		type: 'solid',
		color: resolveColor(paint.color)
	} satisfies TResolvedSolidPaint;
}

export interface TResolvedSolidPaint {
	type: 'solid';
	color: TResolvedColor;
}

export function resolveImagePaint(
	paint: TImagePaint,
	cx: { getAsset: (hash: TAssetHash) => TAsset | null }
): TResolvedImagePaint {
	if (paint.hash == null) {
		return {
			type: 'image',
			altText: paint.altText
		};
	}

	const resolvedAsset = resolveAsset(paint.hash, cx);
	if (resolvedAsset == null) {
		return {
			type: 'image',
			altText: paint.altText
		};
	}

	return {
		type: 'image',
		src: resolvedAsset.src,
		altText: paint.altText
	} satisfies TResolvedImagePaint;
}

export interface TResolvedImagePaint {
	type: 'image';
	src?: string;
	altText?: string;
}

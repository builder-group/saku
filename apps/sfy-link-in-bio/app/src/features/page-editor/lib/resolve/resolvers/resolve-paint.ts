import { TAsset, TAssetHash, TPaint } from '@repo/editor';
import { resolveAsset } from './resolve-asset';
import { resolveColor, TResolvedColor } from './resolve-color';

export function resolvePaint(
	paint: TPaint,
	cx: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	}
): TResolvedPaint {
	switch (paint.type) {
		case 'solid': {
			const color = resolveColor(paint.color);

			return {
				type: 'solid',
				color
			} satisfies TResolvedSolidPaint;
		}

		case 'image': {
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
	}
}

export type TResolvedPaint = TResolvedSolidPaint | TResolvedImagePaint;

export interface TResolvedSolidPaint {
	type: 'solid';
	color: TResolvedColor;
}

export interface TResolvedImagePaint {
	type: 'image';
	src?: string;
	altText?: string;
}

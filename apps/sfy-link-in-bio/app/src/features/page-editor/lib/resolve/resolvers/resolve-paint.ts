import { TAsset, TAssetHash, TPaint } from '@repo/editor';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolvePaint(
	paint: TPaint,
	context: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	}
): TResolvedPaint | undefined {
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
				return undefined;
			}

			const url = resolveAsset(paint.hash, context);
			if (url == null) {
				return undefined;
			}

			return {
				type: 'image',
				url,
				altText: paint.altText
			} satisfies TResolvedImagePaint;
		}

		default:
			return undefined;
	}
}

export type TResolvedPaint = TResolvedSolidPaint | TResolvedImagePaint;

export interface TResolvedSolidPaint {
	type: 'solid';
	color: string; // Resolved from TRgba
}

export interface TResolvedImagePaint {
	type: 'image';
	url: string; // Resolved from TAssetHash
	altText?: string;
}

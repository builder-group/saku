import { resolveReference, rgbaToCssRgba, TReference, TRgba } from '@repo/editor';

export function resolveColor(
	value: TReference<TRgba> | undefined,
	fallback?: TRgba
): string | undefined {
	if (value == null) {
		return undefined;
	}

	const color = resolveReference(value, fallback);
	if (color == null) {
		return undefined;
	}

	return rgbaToCssRgba(color);
}

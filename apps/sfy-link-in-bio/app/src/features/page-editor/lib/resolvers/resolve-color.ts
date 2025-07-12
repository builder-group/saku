import { resolveStyleReference, rgbaToCssRgba, TRgba, TStyleReference } from '@repo/editor';

export function resolveColor(
	value: TStyleReference<TRgba> | undefined,
	fallback?: TRgba
): string | undefined {
	if (value == null) {
		return undefined;
	}
	const color = resolveStyleReference(value, fallback);
	return color != null ? rgbaToCssRgba(color) : undefined;
}

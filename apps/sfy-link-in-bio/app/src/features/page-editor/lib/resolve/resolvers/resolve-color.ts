import { rgbaToCssRgba, TRgba } from '@repo/editor';

export function resolveColor(color: TRgba): string {
	return rgbaToCssRgba(color);
}

import { rgbaToCssRgba, TRgba } from '@repo/editor';

export function resolveColor(color: TRgba): TResolvedColor {
	return rgbaToCssRgba(color);
}

export type TResolvedColor = string;

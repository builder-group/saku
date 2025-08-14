import { resolveReference, TMixin, TRgba, TStrokeStyleMixin } from '@repo/editor';
import { resolveColor } from './resolve-color';

export function resolveStrokeStyleMixin(
	stroke: TStrokeStyleMixin['value'],
	parentMixin?: {
		width: number;
		color: TRgba;
	} | null
): TResolvedStrokeStyleMixin['value'] {
	if (parentMixin == null) {
		return undefined;
	}

	const resolvedStroke = resolveReference(stroke, parentMixin);
	if (resolvedStroke == null) {
		return undefined;
	}

	return {
		width: resolvedStroke.width,
		color: resolveColor(resolvedStroke.color)
	};
}

export type TResolvedStrokeStyleMixin = TMixin<
	'stroke',
	| {
			width: number;
			color: string;
	  }
	| undefined
>;

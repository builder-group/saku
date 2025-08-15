import { Err, Ok, TResult } from '@blgc/utils';
import { resolveReference, TRgba, TStrokeStyleMixin } from '@repo/editor';
import { AppError } from '@/lib';
import { resolveColor } from '../../lib';
import { TResolvedStrokeStyleMixin } from './types';

export function resolveStrokeStyleMixin(
	stroke: TStrokeStyleMixin['value'],
	parentMixin?: {
		width: number;
		color: TRgba;
	} | null
): TResult<TResolvedStrokeStyleMixin['value'], AppError> {
	const resolvedStroke = resolveReference(stroke, parentMixin);
	if (resolvedStroke == null) {
		return Err(new AppError('#ERR_RESOLVE_STROKE'));
	}

	return Ok({
		width: resolvedStroke.width,
		color: resolveColor(resolvedStroke.color)
	});
}

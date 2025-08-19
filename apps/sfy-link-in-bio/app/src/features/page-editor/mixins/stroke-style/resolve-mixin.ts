import { resolveReference, TRgba, TStrokeStyleMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
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
		return Ok(null);
	}

	const resolvedColor = resolveColor(resolvedStroke.color);

	return Ok({
		width: resolvedStroke.width,
		color: resolvedColor,
		styles: {
			border: `${resolvedStroke.width}px solid ${resolvedColor}`
		}
	});
}

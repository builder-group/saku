import { resolveReference, TRgba, TStrokeStyleMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedStrokeStyleMixin } from './types';

export function resolveStrokeStyleMixin(
	stroke: TStrokeStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedStrokeStyleMixin['value'], AppError> {
	const resolvedStroke = resolveReference(stroke, cx.childMixins?.stroke);
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

export type TResolveStrokeStyleMixinParentMixin = {
	width: number;
	color: TRgba;
} | null;

import { TRgba, TStrokeStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor, resolveTokenRef, TNodeResolveContext } from '../../lib';
import { TResolvedStrokeStyleMixin } from './types';

export function resolveStrokeStyleMixin(
	stroke: TStrokeStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedStrokeStyleMixin['value'], AppError> {
	const [isResolvedStorkeOk, resolvedStorkeErr, resolvedStroke] = resolveTokenRef(
		stroke,
		cx.site.getTokenSet('stroke')
	);
	if (!isResolvedStorkeOk) {
		return Err(resolvedStorkeErr.wrapWith('#ERR_RESOLVE_STROKE'));
	}

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

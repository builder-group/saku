import { TMixinTokenSet, TStrokeStyleMixin, TStrokeStyleToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor, resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedStrokeStyleMixin } from './types';

export function resolveStrokeStyleMixin<GTokenSet extends TMixinTokenSet>(
	stroke: TStrokeStyleMixin['value'],
	cx: TMixinResolveContext<TStrokeStyleToken['value'], GTokenSet>
): TResult<TResolvedStrokeStyleMixin['value'], AppError> {
	const [isResolvedStorkeOk, resolvedStorkeErr, resolvedStroke] = resolveTokenRef(
		stroke,
		cx.tokenSet,
		cx.mapToToken
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

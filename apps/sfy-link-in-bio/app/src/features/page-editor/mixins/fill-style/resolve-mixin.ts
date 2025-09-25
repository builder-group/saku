import { TFillStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolvePaint, resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedFillStyleMixin } from './types';

export function resolveFillStyleMixin(
	fill: TFillStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedFillStyleMixin['value'], AppError> {
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveTokenRef(fill, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL'));
	}

	if (resolvedFill == null) {
		return Ok(null);
	}

	const resolvedPaint = resolvePaint(resolvedFill.paint, cx.node.site);

	const styles: {
		backgroundColor?: string;
		backgroundImage?: string;
		backgroundSize?: string;
		backgroundPosition?: string;
		backgroundRepeat?: string;
	} = {};
	switch (resolvedPaint.type) {
		case 'solid': {
			styles.backgroundColor = resolvedPaint.color;
			break;
		}
		case 'image': {
			if (resolvedPaint.src != null) {
				styles.backgroundImage = `url(${resolvedPaint.src})`;
				styles.backgroundSize = 'cover';
				styles.backgroundPosition = 'center top';
				styles.backgroundRepeat = 'no-repeat';
			}
			break;
		}
	}

	return Ok({
		paint: resolvedPaint,
		styles
	});
}

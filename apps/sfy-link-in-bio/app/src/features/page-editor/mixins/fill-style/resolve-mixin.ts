import { TFillStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import * as v from 'valibot';
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

	const [isResolvedPaintOk, resolvedPaintErr, paint] = resolveTokenRef(resolvedFill.paint, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedPaintOk) {
		return Err(resolvedPaintErr.wrapWith('#ERR_RESOLVE_PAINT'));
	}
	const resolvedPaint = resolvePaint(paint, cx.node.site);
	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveTokenRef(
		resolvedFill.opacity,
		{
			tokenMap: cx.tokenMap,
			schema: v.number()
		}
	);
	if (!isResolvedOpacityOk) {
		return Err(resolvedOpacityErr.wrapWith('#ERR_RESOLVE_OPACITY'));
	}

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
		opacity: resolvedOpacity,
		styles
	});
}

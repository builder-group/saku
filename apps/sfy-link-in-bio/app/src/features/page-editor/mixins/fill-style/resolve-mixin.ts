import { TFillStyleMixin, TFillStyleToken, TMixinTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolvePaint, resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedFillStyleMixin } from './types';

export function resolveFillStyleMixin<GTokenSet extends TMixinTokenSet>(
	fill: TFillStyleMixin['value'],
	cx: TMixinResolveContext<TFillStyleToken['value'], GTokenSet>
): TResult<TResolvedFillStyleMixin['value'], AppError> {
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveTokenRef(fill, {
		mixin: { tokenSet: cx.mixinTokenSet, mapToTokenValue: cx.mapToMixinTokenValue }
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

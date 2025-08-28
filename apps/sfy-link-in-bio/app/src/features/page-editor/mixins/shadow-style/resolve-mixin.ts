import { TRgba, TShadowStyleMixin, TShadowStyleToken, TTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor, resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedShadowStyleMixin } from './types';

export function resolveShadowStyleMixin<GTokenSet extends TTokenSet>(
	shadow: TShadowStyleMixin['value'],
	cx: TMixinResolveContext<TShadowStyleToken['value'], GTokenSet>
): TResult<TResolvedShadowStyleMixin['value'], AppError> {
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveTokenRef(
		shadow,
		cx.tokenSet,
		cx.mapToToken
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW'));
	}

	if (resolvedShadow == null) {
		return Ok(null);
	}

	const resolvedColor = resolveColor(resolvedShadow.color);

	return Ok({
		color: resolvedColor,
		offsetX: resolvedShadow.offsetX,
		offsetY: resolvedShadow.offsetY,
		blur: resolvedShadow.blur,
		spread: resolvedShadow.spread,
		styles: {
			boxShadow: `${resolvedShadow.offsetX}px ${resolvedShadow.offsetY}px ${resolvedShadow.blur}px ${resolvedShadow.spread}px ${resolvedColor}`
		}
	});
}

export type TResolveShadowStyleMixinParentMixin = {
	color: TRgba;
	offsetX: number;
	offsetY: number;
	blur: number;
	spread: number;
} | null;

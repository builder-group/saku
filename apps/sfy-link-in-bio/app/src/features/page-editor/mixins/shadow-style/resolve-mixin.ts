import { TRgba, TShadowStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor, resolveTokenRef, TNodeResolveContext } from '../../lib';
import { TResolvedShadowStyleMixin } from './types';

export function resolveShadowStyleMixin(
	shadow: TShadowStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedShadowStyleMixin['value'], AppError> {
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveTokenRef(
		shadow,
		cx.site.getTokenSet('shadow')
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

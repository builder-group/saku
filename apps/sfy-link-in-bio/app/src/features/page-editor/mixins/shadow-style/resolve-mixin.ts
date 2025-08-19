import { resolveReference, TRgba, TShadowStyleMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor } from '../../lib';
import { TResolvedShadowStyleMixin } from './types';

export function resolveShadowStyleMixin(
	shadow: TShadowStyleMixin['value'],
	parentMixin?: {
		color: TRgba;
		offsetX: number;
		offsetY: number;
		blur: number;
		spread: number;
	} | null
): TResult<TResolvedShadowStyleMixin['value'], AppError> {
	const resolvedShadow = resolveReference(shadow, parentMixin);
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

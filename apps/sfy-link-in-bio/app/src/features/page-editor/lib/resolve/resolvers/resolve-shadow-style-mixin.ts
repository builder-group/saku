import { resolveReference, TMixin, TRgba, TShadowStyleMixin } from '@repo/editor';
import { resolveColor } from './resolve-color';

export function resolveShadowStyleMixin(
	shadow: TShadowStyleMixin['value'],
	parentMixin?: {
		color: TRgba;
		offsetX: number;
		offsetY: number;
		blur: number;
		spread: number;
	} | null
): TResolvedShadowStyleMixin['value'] {
	if (parentMixin == null) {
		return undefined;
	}

	const resolvedShadow = resolveReference(shadow, parentMixin);
	if (resolvedShadow == null) {
		return undefined;
	}

	return {
		color: resolveColor(resolvedShadow.color),
		offsetX: resolvedShadow.offsetX,
		offsetY: resolvedShadow.offsetY,
		blur: resolvedShadow.blur,
		spread: resolvedShadow.spread
	};
}

export type TResolvedShadowStyleMixin = TMixin<
	'shadow',
	| {
			color: string;
			offsetX: number;
			offsetY: number;
			blur: number;
			spread: number;
	  }
	| undefined
>;

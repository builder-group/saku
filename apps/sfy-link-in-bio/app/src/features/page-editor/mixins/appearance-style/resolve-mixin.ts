import { resolveReference, TAppearanceStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin(
	appearance: TAppearanceStyleMixin['value'],
	parentMixin?: TResolveAppearanceStyleMixinParentMixin
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const resolvedBorderRadius = resolveReference(appearance.borderRadius, parentMixin?.borderRadius);
	const resolvedOpacity = resolveReference(appearance.opacity, parentMixin?.opacity);
	if (resolvedOpacity == null) {
		return Err(new AppError('#ERR_RESOLVE_OPACITY'));
	}
	const resolvedVisible = resolveReference(appearance.visible, parentMixin?.visible);
	if (resolvedVisible == null) {
		return Err(new AppError('#ERR_RESOLVE_VISIBLE'));
	}

	return Ok({
		visible: resolvedVisible,
		opacity: resolvedOpacity,
		borderRadius: resolvedBorderRadius,
		styles: {
			visibility: resolvedVisible ? 'visible' : 'hidden',
			opacity: `${resolvedOpacity * 100}%`,
			borderRadius: resolvedBorderRadius ? `${resolvedBorderRadius}px` : undefined
		}
	});
}

export interface TResolveAppearanceStyleMixinParentMixin {
	visible: boolean;
	opacity: number;
	borderRadius?: number;
}

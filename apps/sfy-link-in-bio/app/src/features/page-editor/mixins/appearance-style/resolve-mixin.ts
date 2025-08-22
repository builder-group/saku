import { resolveReference, TAppearanceStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin(
	appearance: TAppearanceStyleMixin['value'],
	parentMixin?: { borderRadius: number; opacity: number; visible: boolean }
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const resolvedBorderRadius = resolveReference(appearance.borderRadius, parentMixin?.borderRadius);
	if (resolvedBorderRadius == null) {
		return Err(new AppError('#ERR_RESOLVE_BORDER_RADIUS'));
	}
	const resolvedOpacity = resolveReference(appearance.opacity, parentMixin?.opacity);
	if (resolvedOpacity == null) {
		return Err(new AppError('#ERR_RESOLVE_OPACITY'));
	}
	const resolvedVisible = resolveReference(appearance.visible, parentMixin?.visible);
	if (resolvedVisible == null) {
		return Err(new AppError('#ERR_RESOLVE_VISIBLE'));
	}

	return Ok({
		borderRadius: resolvedBorderRadius,
		opacity: resolvedOpacity,
		visible: resolvedVisible,
		styles: {
			borderRadius: `${resolvedBorderRadius}px`,
			opacity: `${resolvedOpacity * 100}%`,
			visibility: resolvedVisible ? 'visible' : 'hidden'
		}
	});
}

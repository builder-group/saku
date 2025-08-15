import { resolveReference, TAppearanceStyleMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin(
	appearance: TAppearanceStyleMixin['value'],
	parentMixin?: { borderRadius: number; opacity: number; visible: boolean }
): TResolvedAppearanceStyleMixin['value'] {
	if (parentMixin == null) {
		return undefined;
	}

	return {
		borderRadius: resolveReference(appearance.borderRadius, parentMixin?.borderRadius),
		opacity: resolveReference(appearance.opacity, parentMixin?.opacity),
		visible: resolveReference(appearance.visible, parentMixin?.visible)
	};
}

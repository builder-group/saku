import { resolveReference, TLayoutStyleMixin } from '@repo/editor';
import { TResolvedLayoutStyleMixin } from './types';

export function resolveLayoutStyleMixin(
	layout: TLayoutStyleMixin['value'],
	parentMixin?: { padding: number }
): TResolvedLayoutStyleMixin['value'] {
	if (parentMixin == null) {
		return undefined;
	}

	return {
		padding: resolveReference(layout.padding, parentMixin?.padding)
	};
}

import { resolveReference, TLayoutStyleMixin, TMixin } from '@repo/editor';

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

export type TResolvedLayoutStyleMixin = TMixin<
	'layout',
	| {
			padding: number;
	  }
	| undefined
>;

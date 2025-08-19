import { resolveReference, TLayoutStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TResolvedLayoutStyleMixin } from './types';

export function resolveLayoutStyleMixin(
	layout: TLayoutStyleMixin['value'],
	parentMixin?: { padding: number }
): TResult<TResolvedLayoutStyleMixin['value'], AppError> {
	const resolvedPadding = resolveReference(layout.padding, parentMixin?.padding);
	if (resolvedPadding == null) {
		return Err(new AppError('#ERR_RESOLVE_PADDING'));
	}

	return Ok({
		padding: resolvedPadding,
		styles: {
			padding: `${resolvedPadding}px`
		}
	});
}

import { resolveReference, TAutoLayoutStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TResolvedAutoLayoutStyleMixin } from './types';

export function resolveAutoLayoutStyleMixin(
	layout: TAutoLayoutStyleMixin['value'],
	parentMixin?: TResolveAutoLayoutStyleMixinParentMixin
): TResult<TResolvedAutoLayoutStyleMixin['value'], AppError> {
	const resolvedHorizontalPadding = resolveReference(
		layout.horizontalPadding,
		parentMixin?.horizontalPadding
	);
	if (resolvedHorizontalPadding == null) {
		return Err(new AppError('#ERR_RESOLVE_HORIZONTAL_PADDING'));
	}
	const resolvedVerticalPadding = resolveReference(
		layout.verticalPadding,
		parentMixin?.verticalPadding
	);
	if (resolvedVerticalPadding == null) {
		return Err(new AppError('#ERR_RESOLVE_PADDING'));
	}
	const resolvedHorizontalGap = resolveReference(layout.horizontalGap, parentMixin?.horizontalGap);
	if (resolvedHorizontalGap == null) {
		return Err(new AppError('#ERR_RESOLVE_HORIZONTAL_GAP'));
	}
	const resolvedVerticalGap = resolveReference(layout.verticalGap, parentMixin?.verticalGap);
	if (resolvedVerticalGap == null) {
		return Err(new AppError('#ERR_RESOLVE_VERTICAL_GAP'));
	}

	return Ok({
		horizontalPadding: resolvedHorizontalPadding,
		verticalPadding: resolvedVerticalPadding,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding: `${resolvedHorizontalPadding ?? 0}px ${resolvedVerticalPadding ?? 0}px`,
			gap: `${resolvedHorizontalGap ?? 0}px ${resolvedVerticalGap ?? 0}px`
		}
	});
}

export interface TResolveAutoLayoutStyleMixinParentMixin {
	horizontalPadding?: number;
	verticalPadding?: number;
	horizontalGap?: number;
	verticalGap?: number;
}

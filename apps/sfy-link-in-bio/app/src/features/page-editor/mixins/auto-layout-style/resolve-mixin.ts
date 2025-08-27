import { TAutoLayoutStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveNestedTokenRef, TNodeResolveContext } from '../../lib';
import { TResolvedAutoLayoutStyleMixin } from './types';

export function resolveAutoLayoutStyleMixin(
	layout: TAutoLayoutStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedAutoLayoutStyleMixin['value'], AppError> {
	const autoLayoutTokenSet = cx.site.getTokenSet('autoLayout');

	const [isResolvedHorizontalPaddingOk, resolvedHorizontalPaddingErr, resolvedHorizontalPadding] =
		resolveNestedTokenRef(layout, autoLayoutTokenSet, 'horizontalPadding');
	if (!isResolvedHorizontalPaddingOk) {
		return Err(resolvedHorizontalPaddingErr.wrapWith('#ERR_RESOLVE_HORIZONTAL_PADDING'));
	}
	const [isResolvedVerticalPaddingOk, resolvedVerticalPaddingErr, resolvedVerticalPadding] =
		resolveNestedTokenRef(layout, autoLayoutTokenSet, 'verticalPadding');
	if (!isResolvedVerticalPaddingOk) {
		return Err(resolvedVerticalPaddingErr.wrapWith('#ERR_RESOLVE_VERTICAL_PADDING'));
	}
	const [isResolvedHorizontalGapOk, resolvedHorizontalGapErr, resolvedHorizontalGap] =
		resolveNestedTokenRef(layout, autoLayoutTokenSet, 'horizontalGap');
	if (!isResolvedHorizontalGapOk) {
		return Err(resolvedHorizontalGapErr.wrapWith('#ERR_RESOLVE_HORIZONTAL_GAP'));
	}
	const [isResolvedVerticalGapOk, resolvedVerticalGapErr, resolvedVerticalGap] =
		resolveNestedTokenRef(layout, autoLayoutTokenSet, 'verticalGap');
	if (!isResolvedVerticalGapOk) {
		return Err(resolvedVerticalGapErr.wrapWith('#ERR_RESOLVE_VERTICAL_GAP'));
	}

	return Ok({
		horizontalPadding: resolvedHorizontalPadding,
		verticalPadding: resolvedVerticalPadding,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding: `${resolvedVerticalPadding ?? 0}px ${resolvedHorizontalPadding ?? 0}px`,
			gap: `${resolvedVerticalGap ?? 0}px ${resolvedHorizontalGap ?? 0}px`
		}
	});
}

export interface TResolveAutoLayoutStyleMixinParentMixin {
	horizontalPadding?: number;
	verticalPadding?: number;
	horizontalGap?: number;
	verticalGap?: number;
}

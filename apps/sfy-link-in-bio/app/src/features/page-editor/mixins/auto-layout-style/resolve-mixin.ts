import { TAutoLayoutStyleMixin, TAutoLayoutStyleToken, TMixinTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveNestedTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedAutoLayoutStyleMixin } from './types';

export function resolveAutoLayoutStyleMixin<GTokenSet extends TMixinTokenSet>(
	layout: TAutoLayoutStyleMixin['value'],
	cx: TMixinResolveContext<TAutoLayoutStyleToken['value'], GTokenSet>
): TResult<TResolvedAutoLayoutStyleMixin['value'], AppError> {
	const [isResolvedHorizontalPaddingOk, resolvedHorizontalPaddingErr, resolvedHorizontalPadding] =
		resolveNestedTokenRef(layout, cx.tokenSet, cx.mapToToken, 'horizontalPadding');
	if (!isResolvedHorizontalPaddingOk) {
		return Err(resolvedHorizontalPaddingErr.wrapWith('#ERR_RESOLVE_HORIZONTAL_PADDING'));
	}
	const [isResolvedVerticalPaddingOk, resolvedVerticalPaddingErr, resolvedVerticalPadding] =
		resolveNestedTokenRef(layout, cx.tokenSet, cx.mapToToken, 'verticalPadding');
	if (!isResolvedVerticalPaddingOk) {
		return Err(resolvedVerticalPaddingErr.wrapWith('#ERR_RESOLVE_VERTICAL_PADDING'));
	}
	const [isResolvedHorizontalGapOk, resolvedHorizontalGapErr, resolvedHorizontalGap] =
		resolveNestedTokenRef(layout, cx.tokenSet, cx.mapToToken, 'horizontalGap');
	if (!isResolvedHorizontalGapOk) {
		return Err(resolvedHorizontalGapErr.wrapWith('#ERR_RESOLVE_HORIZONTAL_GAP'));
	}
	const [isResolvedVerticalGapOk, resolvedVerticalGapErr, resolvedVerticalGap] =
		resolveNestedTokenRef(layout, cx.tokenSet, cx.mapToToken, 'verticalGap');
	if (!isResolvedVerticalGapOk) {
		return Err(resolvedVerticalGapErr.wrapWith('#ERR_RESOLVE_VERTICAL_GAP'));
	}

	return Ok({
		horizontalPadding: resolvedHorizontalPadding,
		verticalPadding: resolvedVerticalPadding,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding:
				resolvedVerticalPadding != null || resolvedHorizontalPadding != null
					? `${resolvedVerticalPadding ?? 0}px ${resolvedHorizontalPadding ?? 0}px`
					: undefined,
			gap:
				resolvedVerticalGap != null || resolvedHorizontalGap != null
					? `${resolvedVerticalGap ?? 0}px ${resolvedHorizontalGap ?? 0}px`
					: undefined
		}
	});
}

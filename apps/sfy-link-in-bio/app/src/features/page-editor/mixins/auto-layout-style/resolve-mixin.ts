import { resolveTokenRef, TAutoLayoutStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import * as v from 'valibot';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedAutoLayoutStyleMixin } from './types';

export function resolveAutoLayoutStyleMixin(
	layout: TAutoLayoutStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedAutoLayoutStyleMixin['value'], AppError> {
	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] = resolveTokenRef(
		layout,
		{ tokenMap: cx.tokenMap }
	);
	if (!isResolvedAutoLayoutOk) {
		return Err(
			AppError.fromEditorError(resolvedAutoLayoutErr).wrapWith('#ERR_RESOLVE_AUTO_LAYOUT')
		);
	}

	const [isResolvedHorizontalPaddingOk, resolvedHorizontalPaddingErr, resolvedHorizontalPadding] =
		resolveTokenRef(resolvedAutoLayout.horizontalPadding, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		});
	if (!isResolvedHorizontalPaddingOk) {
		return Err(
			AppError.fromEditorError(resolvedHorizontalPaddingErr).wrapWith(
				'#ERR_RESOLVE_HORIZONTAL_PADDING'
			)
		);
	}
	const [isResolvedVerticalPaddingOk, resolvedVerticalPaddingErr, resolvedVerticalPadding] =
		resolveTokenRef(resolvedAutoLayout.verticalPadding, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		});
	if (!isResolvedVerticalPaddingOk) {
		return Err(
			AppError.fromEditorError(resolvedVerticalPaddingErr).wrapWith('#ERR_RESOLVE_VERTICAL_PADDING')
		);
	}
	const [isResolvedHorizontalMarginOk, resolvedHorizontalMarginErr, resolvedHorizontalMargin] =
		resolveTokenRef(resolvedAutoLayout.horizontalMargin, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		});
	if (!isResolvedHorizontalMarginOk) {
		return Err(
			AppError.fromEditorError(resolvedHorizontalMarginErr).wrapWith(
				'#ERR_RESOLVE_HORIZONTAL_MARGIN'
			)
		);
	}
	const [isResolvedVerticalMarginOk, resolvedVerticalMarginErr, resolvedVerticalMargin] =
		resolveTokenRef(resolvedAutoLayout.verticalMargin, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		});
	if (!isResolvedVerticalMarginOk) {
		return Err(
			AppError.fromEditorError(resolvedVerticalMarginErr).wrapWith('#ERR_RESOLVE_VERTICAL_MARGIN')
		);
	}
	const [isResolvedHorizontalGapOk, resolvedHorizontalGapErr, resolvedHorizontalGap] =
		resolveTokenRef(resolvedAutoLayout.horizontalGap, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		});
	if (!isResolvedHorizontalGapOk) {
		return Err(
			AppError.fromEditorError(resolvedHorizontalGapErr).wrapWith('#ERR_RESOLVE_HORIZONTAL_GAP')
		);
	}
	const [isResolvedVerticalGapOk, resolvedVerticalGapErr, resolvedVerticalGap] = resolveTokenRef(
		resolvedAutoLayout.verticalGap,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedVerticalGapOk) {
		return Err(
			AppError.fromEditorError(resolvedVerticalGapErr).wrapWith('#ERR_RESOLVE_VERTICAL_GAP')
		);
	}

	return Ok({
		horizontalPadding: resolvedHorizontalPadding,
		verticalPadding: resolvedVerticalPadding,
		horizontalMargin: resolvedHorizontalMargin,
		verticalMargin: resolvedVerticalMargin,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding:
				resolvedVerticalPadding != null || resolvedHorizontalPadding != null
					? `${resolvedVerticalPadding ?? 0}px ${resolvedHorizontalPadding ?? 0}px`
					: undefined,
			margin:
				resolvedVerticalMargin != null || resolvedHorizontalMargin != null
					? `${resolvedVerticalMargin ?? 0}px ${resolvedHorizontalMargin ?? 0}px`
					: undefined,
			gap:
				resolvedVerticalGap != null || resolvedHorizontalGap != null
					? `${resolvedVerticalGap ?? 0}px ${resolvedHorizontalGap ?? 0}px`
					: undefined
		}
	});
}

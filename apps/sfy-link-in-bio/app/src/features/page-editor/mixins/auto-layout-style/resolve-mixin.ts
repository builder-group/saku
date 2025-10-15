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

	const [isResolvedPaddingTopOk, resolvedPaddingTopErr, resolvedPaddingTop] = resolveTokenRef(
		resolvedAutoLayout.paddingTop,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedPaddingTopOk) {
		return Err(
			AppError.fromEditorError(resolvedPaddingTopErr).wrapWith('#ERR_RESOLVE_PADDING_TOP')
		);
	}
	const [isResolvedPaddingRightOk, resolvedPaddingRightErr, resolvedPaddingRight] = resolveTokenRef(
		resolvedAutoLayout.paddingRight,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedPaddingRightOk) {
		return Err(
			AppError.fromEditorError(resolvedPaddingRightErr).wrapWith('#ERR_RESOLVE_PADDING_RIGHT')
		);
	}
	const [isResolvedPaddingBottomOk, resolvedPaddingBottomErr, resolvedPaddingBottom] =
		resolveTokenRef(resolvedAutoLayout.paddingBottom, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		});
	if (!isResolvedPaddingBottomOk) {
		return Err(
			AppError.fromEditorError(resolvedPaddingBottomErr).wrapWith('#ERR_RESOLVE_PADDING_BOTTOM')
		);
	}
	const [isResolvedPaddingLeftOk, resolvedPaddingLeftErr, resolvedPaddingLeft] = resolveTokenRef(
		resolvedAutoLayout.paddingLeft,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedPaddingLeftOk) {
		return Err(
			AppError.fromEditorError(resolvedPaddingLeftErr).wrapWith('#ERR_RESOLVE_PADDING_LEFT')
		);
	}
	const [isResolvedMarginTopOk, resolvedMarginTopErr, resolvedMarginTop] = resolveTokenRef(
		resolvedAutoLayout.marginTop,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedMarginTopOk) {
		return Err(AppError.fromEditorError(resolvedMarginTopErr).wrapWith('#ERR_RESOLVE_MARGIN_TOP'));
	}
	const [isResolvedMarginRightOk, resolvedMarginRightErr, resolvedMarginRight] = resolveTokenRef(
		resolvedAutoLayout.marginRight,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedMarginRightOk) {
		return Err(
			AppError.fromEditorError(resolvedMarginRightErr).wrapWith('#ERR_RESOLVE_MARGIN_RIGHT')
		);
	}
	const [isResolvedMarginBottomOk, resolvedMarginBottomErr, resolvedMarginBottom] = resolveTokenRef(
		resolvedAutoLayout.marginBottom,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedMarginBottomOk) {
		return Err(
			AppError.fromEditorError(resolvedMarginBottomErr).wrapWith('#ERR_RESOLVE_MARGIN_BOTTOM')
		);
	}
	const [isResolvedMarginLeftOk, resolvedMarginLeftErr, resolvedMarginLeft] = resolveTokenRef(
		resolvedAutoLayout.marginLeft,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.optional(v.number())
		}
	);
	if (!isResolvedMarginLeftOk) {
		return Err(
			AppError.fromEditorError(resolvedMarginLeftErr).wrapWith('#ERR_RESOLVE_MARGIN_LEFT')
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

	// Generate CSS styles from individual values
	const paddingTop = resolvedPaddingTop ?? 0;
	const paddingRight = resolvedPaddingRight ?? 0;
	const paddingBottom = resolvedPaddingBottom ?? 0;
	const paddingLeft = resolvedPaddingLeft ?? 0;
	const hasPadding =
		paddingTop !== 0 || paddingRight !== 0 || paddingBottom !== 0 || paddingLeft !== 0;

	const marginTop = resolvedMarginTop ?? 0;
	const marginRight = resolvedMarginRight ?? 0;
	const marginBottom = resolvedMarginBottom ?? 0;
	const marginLeft = resolvedMarginLeft ?? 0;
	const hasMargin = marginTop !== 0 || marginRight !== 0 || marginBottom !== 0 || marginLeft !== 0;

	return Ok({
		paddingTop: resolvedPaddingTop,
		paddingRight: resolvedPaddingRight,
		paddingBottom: resolvedPaddingBottom,
		paddingLeft: resolvedPaddingLeft,
		marginTop: resolvedMarginTop,
		marginRight: resolvedMarginRight,
		marginBottom: resolvedMarginBottom,
		marginLeft: resolvedMarginLeft,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding: hasPadding
				? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
				: undefined,
			margin: hasMargin
				? `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`
				: undefined,
			gap:
				resolvedVerticalGap != null || resolvedHorizontalGap != null
					? `${resolvedVerticalGap ?? 0}px ${resolvedHorizontalGap ?? 0}px`
					: undefined
		}
	});
}

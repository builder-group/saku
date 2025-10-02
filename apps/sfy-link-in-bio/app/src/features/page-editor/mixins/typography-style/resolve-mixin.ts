import { resolveTokenRef, TLetterSpacing, TLineHeight, TTypographyStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import * as v from 'valibot';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedTypographyStyleMixin } from './types';

export function resolveTypographyStyleMixin(
	typography: TTypographyStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedTypographyStyleMixin['value'], AppError> {
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] = resolveTokenRef(
		typography,
		{ tokenMap: cx.tokenMap }
	);
	if (!isResolvedTypographyOk) {
		return Err(AppError.fromEditorError(resolvedTypographyErr).wrapWith('#ERR_RESOLVE_TYPOGRAPHY'));
	}

	const [isResolvedFontOk, resolvedFontErr, resolvedFont] = resolveTokenRef(
		resolvedTypography.font,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedFontOk) {
		return Err(AppError.fromEditorError(resolvedFontErr).wrapWith('#ERR_RESOLVE_FONT'));
	}
	const [isResolvedFontSizeOk, resolvedFontSizeErr, resolvedFontSize] = resolveTokenRef(
		resolvedTypography.fontSize,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.number()
		}
	);
	if (!isResolvedFontSizeOk) {
		return Err(AppError.fromEditorError(resolvedFontSizeErr).wrapWith('#ERR_RESOLVE_FONT_SIZE'));
	}
	const [
		isResolvedTextAlignHorizontalOk,
		resolvedTextAlignHorizontalErr,
		resolvedTextAlignHorizontal
	] = resolveTokenRef(resolvedTypography.textAlignHorizontal, {
		tokenMap: cx.tokenMap,
		expectedSchema: v.union([v.literal('start'), v.literal('center'), v.literal('end')])
	});
	if (!isResolvedTextAlignHorizontalOk) {
		return Err(
			AppError.fromEditorError(resolvedTextAlignHorizontalErr).wrapWith(
				'#ERR_RESOLVE_TEXT_ALIGN_HORIZONTAL'
			)
		);
	}
	const [isResolvedTextAlignVerticalOk, resolvedTextAlignVerticalErr, resolvedTextAlignVertical] =
		resolveTokenRef(resolvedTypography.textAlignVertical, {
			tokenMap: cx.tokenMap,
			expectedSchema: v.union([v.literal('start'), v.literal('center'), v.literal('end')])
		});
	if (!isResolvedTextAlignVerticalOk) {
		return Err(
			AppError.fromEditorError(resolvedTextAlignVerticalErr).wrapWith(
				'#ERR_RESOLVE_TEXT_ALIGN_VERTICAL'
			)
		);
	}
	const [isResolvedLineHeightOk, resolvedLineHeightErr, resolvedLineHeight] = resolveTokenRef(
		resolvedTypography.lineHeight,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedLineHeightOk) {
		return Err(
			AppError.fromEditorError(resolvedLineHeightErr).wrapWith('#ERR_RESOLVE_LINE_HEIGHT')
		);
	}
	const [isResolvedLetterSpacingOk, resolvedLetterSpacingErr, resolvedLetterSpacing] =
		resolveTokenRef(resolvedTypography.letterSpacing, {
			tokenMap: cx.tokenMap
		});
	if (!isResolvedLetterSpacingOk) {
		return Err(
			AppError.fromEditorError(resolvedLetterSpacingErr).wrapWith('#ERR_RESOLVE_LETTER_SPACING')
		);
	}

	return Ok({
		font: resolvedFont,
		fontSize: resolvedFontSize,
		textAlignHorizontal: resolvedTextAlignHorizontal,
		textAlignVertical: resolvedTextAlignVertical,
		lineHeight: resolvedLineHeight,
		letterSpacing: resolvedLetterSpacing,
		styles: {
			fontFamily: resolvedFont.family,
			fontSize: `${resolvedFontSize}px`,
			textAlign: resolvedTextAlignHorizontal,
			lineHeight: resolveLineHeight(resolvedLineHeight),
			letterSpacing: resolveLetterSpacing(resolvedLetterSpacing)
		}
	});
}

export function resolveLineHeight(lineHeight: TLineHeight): React.CSSProperties['lineHeight'] {
	switch (lineHeight.type) {
		case 'percent':
			return `${lineHeight.value}%`;
		case 'pixel':
			return `${lineHeight.value}px`;
		case 'auto':
			return 'normal';
	}
}

export function resolveLetterSpacing(
	letterSpacing: TLetterSpacing
): React.CSSProperties['letterSpacing'] {
	switch (letterSpacing.type) {
		case 'percent':
			return `${letterSpacing.value}%`;
		case 'pixel':
			return `${letterSpacing.value}px`;
		case 'auto':
			return 'normal';
	}
}

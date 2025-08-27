import {
	TFont,
	TLetterSpacing,
	TLineHeight,
	TTextAlign,
	TTypographyStyleMixin
} from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveNestedTokenRef, TNodeResolveContext } from '../../lib';
import { TResolvedTypographyStyleMixin } from './types';

export function resolveTypographyStyleMixin(
	typography: TTypographyStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedTypographyStyleMixin['value'], AppError> {
	const typographyTokenSet = cx.site.getTokenSet('typography');

	const [isResolvedFontOk, resolvedFontErr, resolvedFont] = resolveNestedTokenRef(
		typography,
		typographyTokenSet,
		'font'
	);
	if (!isResolvedFontOk) {
		return Err(resolvedFontErr.wrapWith('#ERR_RESOLVE_FONT'));
	}
	const [isResolvedFontSizeOk, resolvedFontSizeErr, resolvedFontSize] = resolveNestedTokenRef(
		typography,
		typographyTokenSet,
		'fontSize'
	);
	if (!isResolvedFontSizeOk) {
		return Err(resolvedFontSizeErr.wrapWith('#ERR_RESOLVE_FONT_SIZE'));
	}
	const [
		isResolvedTextAlignHorizontalOk,
		resolvedTextAlignHorizontalErr,
		resolvedTextAlignHorizontal
	] = resolveNestedTokenRef(typography, typographyTokenSet, 'textAlignHorizontal');
	if (!isResolvedTextAlignHorizontalOk) {
		return Err(resolvedTextAlignHorizontalErr.wrapWith('#ERR_RESOLVE_TEXT_ALIGN_HORIZONTAL'));
	}
	const [isResolvedTextAlignVerticalOk, resolvedTextAlignVerticalErr, resolvedTextAlignVertical] =
		resolveNestedTokenRef(typography, typographyTokenSet, 'textAlignVertical');
	if (!isResolvedTextAlignVerticalOk) {
		return Err(resolvedTextAlignVerticalErr.wrapWith('#ERR_RESOLVE_TEXT_ALIGN_VERTICAL'));
	}
	const [isResolvedLineHeightOk, resolvedLineHeightErr, resolvedLineHeight] = resolveNestedTokenRef(
		typography,
		typographyTokenSet,
		'lineHeight'
	);
	if (!isResolvedLineHeightOk) {
		return Err(resolvedLineHeightErr.wrapWith('#ERR_RESOLVE_LINE_HEIGHT'));
	}
	const [isResolvedLetterSpacingOk, resolvedLetterSpacingErr, resolvedLetterSpacing] =
		resolveNestedTokenRef(typography, typographyTokenSet, 'letterSpacing');
	if (!isResolvedLetterSpacingOk) {
		return Err(resolvedLetterSpacingErr.wrapWith('#ERR_RESOLVE_LETTER_SPACING'));
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
			textAlignHorizontal: resolvedTextAlignHorizontal,
			textAlignVertical: resolvedTextAlignVertical,
			lineHeight: resolveLineHeight(resolvedLineHeight),
			letterSpacing: resolveLetterSpacing(resolvedLetterSpacing)
		}
	});
}

export interface TResolveTypographyStyleMixinParentMixin {
	font: TFont;
	fontSize: number;
	textAlignHorizontal: TTextAlign;
	textAlignVertical: TTextAlign;
	lineHeight: TLineHeight;
	letterSpacing: TLetterSpacing;
}

function resolveLineHeight(lineHeight: TLineHeight): React.CSSProperties['lineHeight'] {
	switch (lineHeight.type) {
		case 'percent':
			return `${lineHeight.value}%`;
		case 'pixel':
			return `${lineHeight.value}px`;
		case 'auto':
			return 'normal';
	}
}

function resolveLetterSpacing(letterSpacing: TLetterSpacing): React.CSSProperties['letterSpacing'] {
	switch (letterSpacing.type) {
		case 'percent':
			return `${letterSpacing.value}%`;
		case 'pixel':
			return `${letterSpacing.value}px`;
		case 'auto':
			return 'normal';
	}
}

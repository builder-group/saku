import {
	resolveReference,
	TFont,
	TLetterSpacing,
	TLineHeight,
	TTextAlign,
	TTypographyStyleMixin
} from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TResolvedTypographyStyleMixin } from './types';

export function resolveTypographyStyleMixin(
	typography: TTypographyStyleMixin['value'],
	parentMixin?: TResolveTypographyStyleMixinParentMixin
): TResult<TResolvedTypographyStyleMixin['value'], AppError> {
	const resolvedFont = resolveReference(typography.font, parentMixin?.font);
	if (resolvedFont == null) {
		return Err(new AppError('#ERR_RESOLVE_FONT'));
	}
	const resolvedFontSize = resolveReference(typography.fontSize, parentMixin?.fontSize);
	if (resolvedFontSize == null) {
		return Err(new AppError('#ERR_RESOLVE_FONT_SIZE'));
	}
	const resolvedTextAlignHorizontal = resolveReference(
		typography.textAlignHorizontal,
		parentMixin?.textAlignHorizontal
	);
	if (resolvedTextAlignHorizontal == null) {
		return Err(new AppError('#ERR_RESOLVE_TEXT_ALIGN_HORIZONTAL'));
	}
	const resolvedTextAlignVertical = resolveReference(
		typography.textAlignVertical,
		parentMixin?.textAlignVertical
	);
	if (resolvedTextAlignVertical == null) {
		return Err(new AppError('#ERR_RESOLVE_TEXT_ALIGN_VERTICAL'));
	}
	const resolvedLineHeight = resolveReference(typography.lineHeight, parentMixin?.lineHeight);
	if (resolvedLineHeight == null) {
		return Err(new AppError('#ERR_RESOLVE_LINE_HEIGHT'));
	}
	const resolvedLetterSpacing = resolveReference(
		typography.letterSpacing,
		parentMixin?.letterSpacing
	);
	if (resolvedLetterSpacing == null) {
		return Err(new AppError('#ERR_RESOLVE_LETTER_SPACING'));
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

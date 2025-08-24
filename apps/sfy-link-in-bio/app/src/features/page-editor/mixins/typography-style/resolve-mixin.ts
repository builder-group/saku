import {
	resolveReference,
	TFont,
	TLetterSpacing,
	TLineHeight,
	TRgba,
	TTextAlign,
	TTypographyStyleMixin
} from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor } from '../../lib';
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
	const unreferencedTextColor = resolveReference(typography.textColor, parentMixin?.textColor);
	if (unreferencedTextColor == null) {
		return Err(new AppError('#ERR_RESOLVE_TEXT_COLOR'));
	}
	const resolvedTextColor = resolveColor(unreferencedTextColor);
	const resolvedTextAlign = resolveReference(typography.textAlign, parentMixin?.textAlign);
	if (resolvedTextAlign == null) {
		return Err(new AppError('#ERR_RESOLVE_TEXT_ALIGN'));
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
		textColor: resolvedTextColor,
		textAlign: resolvedTextAlign,
		lineHeight: resolvedLineHeight,
		letterSpacing: resolvedLetterSpacing,
		styles: {
			fontFamily: resolvedFont.family,
			fontSize: `${resolvedFontSize}px`,
			color: resolvedTextColor,
			textAlign: resolvedTextAlign,
			lineHeight: typeof resolvedLineHeight === 'number' ? resolvedLineHeight : 'auto',
			letterSpacing: `${resolvedLetterSpacing}px`
		}
	});
}

export interface TResolveTypographyStyleMixinParentMixin {
	font: TFont;
	fontSize: number;
	textColor: TRgba;
	textAlign: TTextAlign;
	lineHeight: TLineHeight;
	letterSpacing: TLetterSpacing;
}

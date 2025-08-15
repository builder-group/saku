import { Err, Ok, TResult } from '@blgc/utils';
import { resolveReference, TFont, TRgba, TTypographyStyleMixin } from '@repo/editor';
import { AppError } from '@/lib';
import { resolveColor } from '../../lib';
import { TResolvedTypographyStyleMixin } from './types';

export function resolveTypographyStyleMixin(
	typography: TTypographyStyleMixin['value'],
	parentMixin?: {
		font: TFont;
		fontSize: number;
		textColor: TRgba;
		textAlign: 'left' | 'center' | 'right';
		lineHeight: number | 'auto';
		letterSpacing: number | 'auto';
	}
): TResult<TResolvedTypographyStyleMixin['value'], AppError> {
	const resolvedFont = resolveReference(typography.font, parentMixin?.font);
	if (resolvedFont == null) {
		return Err(new AppError('#ERR_RESOLVE_FONT'));
	}
	const resolvedFontSize = resolveReference(typography.fontSize, parentMixin?.fontSize);
	if (resolvedFontSize == null) {
		return Err(new AppError('#ERR_RESOLVE_FONT_SIZE'));
	}
	const resolvedTextColor = resolveReference(typography.textColor, parentMixin?.textColor);
	if (resolvedTextColor == null) {
		return Err(new AppError('#ERR_RESOLVE_TEXT_COLOR'));
	}
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
		textColor: resolveColor(resolvedTextColor),
		textAlign: resolvedTextAlign,
		lineHeight: resolvedLineHeight,
		letterSpacing: resolvedLetterSpacing
	});
}

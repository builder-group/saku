import { resolveReference, TFont, TRgba, TTypographyStyleMixin } from '@repo/editor';
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
): TResolvedTypographyStyleMixin['value'] {
	if (parentMixin == null) {
		return undefined;
	}

	return {
		font: resolveReference(typography.font, parentMixin.font),
		fontSize: resolveReference(typography.fontSize, parentMixin.fontSize),
		textColor: resolveColor(resolveReference(typography.textColor, parentMixin.textColor)),
		textAlign: resolveReference(typography.textAlign, parentMixin.textAlign),
		lineHeight: resolveReference(typography.lineHeight, parentMixin.lineHeight),
		letterSpacing: resolveReference(typography.letterSpacing, parentMixin.letterSpacing)
	};
}

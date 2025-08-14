import { resolveReference, TFont, TMixin, TRgba, TTypographyStyleMixin } from '@repo/editor';

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
		textColor: resolveReference(typography.textColor, parentMixin.textColor),
		textAlign: resolveReference(typography.textAlign, parentMixin.textAlign),
		lineHeight: resolveReference(typography.lineHeight, parentMixin.lineHeight),
		letterSpacing: resolveReference(typography.letterSpacing, parentMixin.letterSpacing)
	};
}

export type TResolvedTypographyStyleMixin = TMixin<
	'typography',
	| {
			font: TFont;
			fontSize: number;
			textColor: TRgba;
			textAlign: 'left' | 'center' | 'right';
			lineHeight: number | 'auto';
			letterSpacing: number | 'auto';
	  }
	| undefined
>;

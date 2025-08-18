import { TFont, TLetterSpacing, TLineHeight, TMixin, TTextAlign } from '@repo/editor';

export type TResolvedTypographyStyleMixin = TMixin<
	'typography',
	{
		font: TFont;
		fontSize: number;
		textColor: string;
		textAlign: TTextAlign;
		lineHeight: TLineHeight;
		letterSpacing: TLetterSpacing;
	}
>;

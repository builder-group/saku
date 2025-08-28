import { TBaseMixin, TFont, TLetterSpacing, TLineHeight, TTextAlign } from '@repo/editor';

export type TResolvedTypographyStyleMixin = TBaseMixin<
	'typography',
	{
		font: TFont;
		fontSize: number;
		textAlignHorizontal: TTextAlign;
		textAlignVertical: TTextAlign;
		lineHeight: TLineHeight;
		letterSpacing: TLetterSpacing;
		// Computed CSS styles
		styles: {
			fontFamily: React.CSSProperties['fontFamily'];
			fontSize: React.CSSProperties['fontSize'];
			textAlign: React.CSSProperties['textAlign'];
			lineHeight: React.CSSProperties['lineHeight'];
			letterSpacing: React.CSSProperties['letterSpacing'];
		};
	}
>;

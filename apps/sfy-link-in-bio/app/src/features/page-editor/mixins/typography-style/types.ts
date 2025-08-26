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
			textAlignHorizontal: React.CSSProperties['textAlign'];
			textAlignVertical: React.CSSProperties['textAlign'];
			lineHeight: React.CSSProperties['lineHeight'];
			letterSpacing: React.CSSProperties['letterSpacing'];
		};
	}
>;

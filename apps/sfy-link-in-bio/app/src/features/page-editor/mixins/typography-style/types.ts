import { TFont, TLetterSpacing, TLineHeight, TMixin, TTextAlign } from '@repo/editor';
import { TResolvedColor } from '../../lib';

export type TResolvedTypographyStyleMixin = TMixin<
	'typography',
	{
		font: TFont;
		fontSize: number;
		textColor: TResolvedColor;
		textAlign: TTextAlign;
		lineHeight: TLineHeight;
		letterSpacing: TLetterSpacing;
		// Computed CSS styles
		styles: {
			fontFamily: React.CSSProperties['fontFamily'];
			fontSize: React.CSSProperties['fontSize'];
			color: React.CSSProperties['color'];
			textAlign: React.CSSProperties['textAlign'];
			lineHeight: React.CSSProperties['lineHeight'];
			letterSpacing: React.CSSProperties['letterSpacing'];
		};
	}
>;

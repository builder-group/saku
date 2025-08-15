import { TFont, TMixin, TRgba } from '@repo/editor';

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

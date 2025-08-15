import { TFont, TMixin } from '@repo/editor';

export type TResolvedTypographyStyleMixin = TMixin<
	'typography',
	| {
			font: TFont;
			fontSize: number;
			textColor: string;
			textAlign: 'left' | 'center' | 'right';
			lineHeight: number | 'auto';
			letterSpacing: number | 'auto';
	  }
	| undefined
>;

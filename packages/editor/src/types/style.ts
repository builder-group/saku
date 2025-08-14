import { TRgba } from '../lib';
import { TFont, TPaint, TReference } from './utils';

export interface TFillStyle {
	fill: TReference<TPaint>;
}

export interface TLayoutStyle {
	padding: TReference<number>;
}

export interface TBorderStyle {
	radius: TReference<number>;
	width: TReference<number>;
	color: TReference<TRgba>;
}

export interface TShadowStyle {
	color: TReference<TRgba>;
	offsetX: TReference<number>;
	offsetY: TReference<number>;
	blur: TReference<number>;
	spread: TReference<number>;
}

export interface TTypographyStyle {
	font: TReference<TFont>;
	fontSize: TReference<number>;
	textColor: TReference<TRgba>;
	textAlign: TReference<'left' | 'center' | 'right'>;
	lineHeight: TReference<number>;
	letterSpacing: TReference<number>;
	fontWeight: TReference<number>;
}

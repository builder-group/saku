import { TRgba } from '../lib';
import { TFont, TPaint, TReference } from './utils';

export interface TLayoutStyle {
	layout: {
		padding: TReference<number>;
	};
}

export interface TAppearanceStyle {
	appearance: {
		borderRadius: TReference<number>;
		opacity: TReference<number>;
	};
}

export interface TTypographyStyle {
	typography: {
		font: TReference<TFont>;
		fontSize: TReference<number>;
		textColor: TReference<TRgba>;
		textAlign: TReference<'left' | 'center' | 'right'>;
		lineHeight: TReference<number | 'auto'>;
		letterSpacing: TReference<number | 'auto'>;
	};
}

export interface TFillStyle {
	fill: TReference<
		| {
				paint: TPaint;
				opacity: number;
		  }
		| false
	>;
}

export interface TStrokeStyle {
	stroke: TReference<
		| {
				width: number;
				color: TRgba;
		  }
		| false
	>;
}

export interface TShadowStyle {
	shadow: TReference<
		| {
				color: TRgba;
				offsetX: number;
				offsetY: number;
				blur: number;
				spread: number;
		  }
		| false
	>;
}

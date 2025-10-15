import { TBaseMixin } from '@repo/editor';

export type TResolvedAutoLayoutStyleMixin = TBaseMixin<
	'autoLayout',
	{
		paddingTop?: number;
		paddingRight?: number;
		paddingBottom?: number;
		paddingLeft?: number;
		marginTop?: number;
		marginRight?: number;
		marginBottom?: number;
		marginLeft?: number;
		horizontalGap?: number;
		verticalGap?: number;
		// Computed CSS styles
		styles: {
			padding: React.CSSProperties['padding'];
			margin: React.CSSProperties['margin'];
			gap: React.CSSProperties['gap'];
		};
	}
>;

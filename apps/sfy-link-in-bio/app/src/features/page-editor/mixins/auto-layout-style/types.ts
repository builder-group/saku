import { TBaseMixin } from '@repo/editor';

export type TResolvedAutoLayoutStyleMixin = TBaseMixin<
	'autoLayout',
	{
		horizontalPadding?: number;
		verticalPadding?: number;
		horizontalMargin?: number;
		verticalMargin?: number;
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

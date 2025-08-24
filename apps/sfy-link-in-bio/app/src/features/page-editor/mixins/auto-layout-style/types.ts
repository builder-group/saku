import { TMixin } from '@repo/editor';

export type TResolvedAutoLayoutStyleMixin = TMixin<
	'autoLayout',
	{
		horizontalPadding?: number;
		verticalPadding?: number;
		horizontalGap?: number;
		verticalGap?: number;
		// Computed CSS styles
		styles: {
			padding: React.CSSProperties['padding'];
			gap: React.CSSProperties['gap'];
		};
	}
>;

import { TMixin } from '@repo/editor';

export type TResolvedLayoutStyleMixin = TMixin<
	'layout',
	{
		padding: number;
		// Computed CSS styles
		styles: {
			padding: React.CSSProperties['padding'];
		};
	}
>;

import { TMixin } from '@repo/editor';

export type TResolvedPageLayoutStyleMixin = TMixin<
	'layout',
	{
		spacing: number;
		// Computed CSS styles
		styles: {
			gap: React.CSSProperties['gap'];
		};
	}
>;

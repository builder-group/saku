import { TMixin } from '@repo/editor';

export type TResolvedAppearanceStyleMixin = TMixin<
	'appearance',
	{
		visible: boolean;
		opacity: number;
		borderRadius?: number;
		// Computed CSS styles
		styles: {
			visibility: React.CSSProperties['visibility'];
			opacity: React.CSSProperties['opacity'];
			borderRadius?: React.CSSProperties['borderRadius'];
		};
	}
>;

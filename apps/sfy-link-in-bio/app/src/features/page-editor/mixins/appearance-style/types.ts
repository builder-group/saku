import { TMixin } from '@repo/editor';

export type TResolvedAppearanceStyleMixin = TMixin<
	'appearance',
	{
		borderRadius: number;
		opacity: number;
		visible: boolean;
		// Computed CSS styles
		styles: {
			borderRadius: React.CSSProperties['borderRadius'];
			opacity: React.CSSProperties['opacity'];
			visibility: React.CSSProperties['visibility'];
		};
	}
>;

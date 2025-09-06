import { TBaseMixin } from '@repo/editor';

export type TResolvedAppearanceStyleMixin = TBaseMixin<
	'appearance',
	{
		visible: boolean;
		opacity: number;
		borderRadius: number | undefined;
		// Computed CSS styles
		styles: {
			visibility: React.CSSProperties['visibility'];
			opacity: React.CSSProperties['opacity'];
			borderRadius?: React.CSSProperties['borderRadius'];
		};
	}
>;

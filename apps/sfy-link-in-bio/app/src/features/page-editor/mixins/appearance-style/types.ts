import { TBaseMixin } from '@repo/editor';

export type TResolvedAppearanceStyleMixin = TBaseMixin<
	'appearance',
	{
		visible: boolean;
		opacity: number;
		borderRadius: number | undefined;
		// Computed CSS styles
		styles: {
			display?: React.CSSProperties['display'];
			opacity: React.CSSProperties['opacity'];
			borderRadius?: React.CSSProperties['borderRadius'];
		};
	}
>;

import { TBaseMixin } from '@repo/editor';
import { TResolvedColor } from '../../lib';

export type TResolvedShadowStyleMixin = TBaseMixin<
	'shadow',
	{
		color: TResolvedColor;
		offsetX: number;
		offsetY: number;
		blur: number;
		spread: number;
		// Computed CSS styles
		styles: {
			boxShadow: React.CSSProperties['boxShadow'];
		};
	} | null
>;

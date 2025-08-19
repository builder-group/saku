import { TMixin } from '@repo/editor';
import { TResolvedColor } from '../../lib';

export type TResolvedShadowStyleMixin = TMixin<
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

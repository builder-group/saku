import { TMixin } from '@repo/editor';
import { TResolvedColor } from '../../lib';

export type TResolvedStrokeStyleMixin = TMixin<
	'stroke',
	{
		width: number;
		color: TResolvedColor;
		// Computed CSS styles
		styles: {
			border: React.CSSProperties['border'];
		};
	} | null
>;

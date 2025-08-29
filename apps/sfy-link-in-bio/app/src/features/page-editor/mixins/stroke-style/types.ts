import { TBaseMixin } from '@repo/editor';
import { TResolvedColor } from '../../lib';

export type TResolvedStrokeStyleMixin = TBaseMixin<
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

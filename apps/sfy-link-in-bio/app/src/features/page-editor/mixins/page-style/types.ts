import { TMixin } from '@repo/editor';
import { TResolvedFillStyleMixin } from '../fill-style';

export type TResolvedPageStyleMixin = TMixin<
	'page',
	{
		layout: {
			spacing: number;
			// Computed CSS styles
			styles: {
				gap: React.CSSProperties['gap'];
			};
		};
		fill: TResolvedFillStyleMixin['value'];
	}
>;

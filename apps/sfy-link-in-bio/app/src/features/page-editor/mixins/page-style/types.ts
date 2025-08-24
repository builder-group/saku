import { TMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
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
		appearance: TResolvedAppearanceStyleMixin['value'];
		fill: TResolvedFillStyleMixin['value'];
	}
>;

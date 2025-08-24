import { TMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedLayoutStyleMixin } from '../layout-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';

export type TResolvedCardStyleMixin = TMixin<
	'card',
	{
		layout: TResolvedLayoutStyleMixin['value'];
		appearance: TResolvedAppearanceStyleMixin['value'];
		fill: TResolvedFillStyleMixin['value'];
		stroke: TResolvedStrokeStyleMixin['value'];
		shadow: TResolvedShadowStyleMixin['value'];
	}
>;

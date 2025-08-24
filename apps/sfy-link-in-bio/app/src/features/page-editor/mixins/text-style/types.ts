import { TMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';
import { TResolvedTypographyStyleMixin } from '../typography-style';

export type TResolvedTextStyleMixin = TMixin<
	'text',
	{
		appearance: TResolvedAppearanceStyleMixin['value'];
		typography: TResolvedTypographyStyleMixin['value'];
		fill: TResolvedFillStyleMixin['value'];
		stroke: TResolvedStrokeStyleMixin['value'];
		shadow: TResolvedShadowStyleMixin['value'];
	}
>;

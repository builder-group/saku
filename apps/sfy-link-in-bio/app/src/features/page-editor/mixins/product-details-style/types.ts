import { TBaseMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedPrimaryButtonStyleMixin } from '../button-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedImageStyleMixin } from '../image-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';
import { TResolvedTextStyleMixin, TResolvedXlTextStyleMixin } from '../text-style';

export type TResolvedProductDetailsStyleMixin = TBaseMixin<
	'productDetails',
	{
		appearance: TResolvedAppearanceStyleMixin['value'];
		fill: TResolvedFillStyleMixin['value'];
		stroke: TResolvedStrokeStyleMixin['value'];
		shadow: TResolvedShadowStyleMixin['value'];
		textXl: TResolvedXlTextStyleMixin['value'];
		text: TResolvedTextStyleMixin['value'];
		buttonPrimary: TResolvedPrimaryButtonStyleMixin['value'];
		image: TResolvedImageStyleMixin['value'];
		styles: TResolvedAppearanceStyleMixin['value']['styles'] &
			Partial<NonNullable<TResolvedFillStyleMixin['value']>['styles']> &
			Partial<NonNullable<TResolvedStrokeStyleMixin['value']>['styles']> &
			Partial<NonNullable<TResolvedShadowStyleMixin['value']>['styles']>;
	}
>;

import { TBaseMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';
import { TResolvedTextStyleMixin } from '../text-style';

export type TResolvedBannerStyleMixin = TBaseMixin<
	'banner',
	{
		appearance: TResolvedAppearanceStyleMixin['value'];
		fill: TResolvedFillStyleMixin['value'];
		stroke: TResolvedStrokeStyleMixin['value'];
		shadow: TResolvedShadowStyleMixin['value'];
		text: TResolvedTextStyleMixin['value'];
		styles: TResolvedAppearanceStyleMixin['value']['styles'] &
			Partial<NonNullable<TResolvedFillStyleMixin['value']>['styles']> &
			Partial<NonNullable<TResolvedStrokeStyleMixin['value']>['styles']> &
			Partial<NonNullable<TResolvedShadowStyleMixin['value']>['styles']>;
	}
>;
export type TResolvedBannerSecondaryStyleMixin = TBaseMixin<
	'bannerSecondary',
	TResolvedBannerStyleMixin['value']
>;
export type TResolvedBannerNeutralStyleMixin = TBaseMixin<
	'bannerNeutral',
	TResolvedBannerStyleMixin['value']
>;

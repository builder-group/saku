import { TBaseMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';
import { TResolvedTextStyleMixin } from '../text-style';

export type TResolvedBadgeStyleMixin = TBaseMixin<
	'badge',
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
export type TResolvedBadgeSecondaryStyleMixin = TBaseMixin<
	'badgeSecondary',
	TResolvedBadgeStyleMixin['value']
>;
export type TResolvedBadgeNeutralStyleMixin = TBaseMixin<
	'badgeNeutral',
	TResolvedBadgeStyleMixin['value']
>;

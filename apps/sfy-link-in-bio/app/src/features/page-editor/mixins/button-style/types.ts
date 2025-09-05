import { TBaseMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';
import { TResolvedTextStyleMixin } from '../text-style';

export type TResolvedButtonStyleMixin = TBaseMixin<
	'button',
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
export type TResolvedPrimaryButtonStyleMixin = TBaseMixin<
	'buttonPrimary',
	TResolvedButtonStyleMixin['value']
>;
export type TResolvedNeutralButtonStyleMixin = TBaseMixin<
	'buttonNeutral',
	TResolvedButtonStyleMixin['value']
>;

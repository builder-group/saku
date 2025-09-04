import { TBaseMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedFillStyleMixin } from '../fill-style';
import { TResolvedShadowStyleMixin } from '../shadow-style';
import { TResolvedStrokeStyleMixin } from '../stroke-style';
import { TResolvedTypographyStyleMixin } from '../typography-style';

export type TResolvedTextStyleMixin = TBaseMixin<
	'text',
	{
		appearance: TResolvedAppearanceStyleMixin['value'];
		typography: TResolvedTypographyStyleMixin['value'];
		fill: TResolvedFillStyleMixin['value'];
		stroke: TResolvedStrokeStyleMixin['value'];
		shadow: TResolvedShadowStyleMixin['value'];
		styles: {
			color?: string;
			WebkitTextStroke?: string;
			textShadow?: string;
		} & TResolvedAppearanceStyleMixin['value']['styles'] &
			TResolvedTypographyStyleMixin['value']['styles'];
	}
>;
export type TResolvedXlTextStyleMixin = TBaseMixin<'xlText', TResolvedTextStyleMixin['value']>;
export type TResolvedSmTextStyleMixin = TBaseMixin<'smText', TResolvedTextStyleMixin['value']>;

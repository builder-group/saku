import { TBaseContentVariant, TBaseMixin, TBaseNode, TIdMixin, TRichContent } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedNeutralBadgeStyleMixin,
	TResolvedPrimaryButtonStyleMixin,
	TResolvedProductDetailsStyleMixin,
	TResolvedSecondaryBadgeStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedProductNode<
	GContent extends TResolvedProductNodeContent = TResolvedProductNodeContent
> = TBaseNode<
	TResolvedProductNodeMixin<GContent>,
	[
		TIdMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin,
		TResolvedPrimaryButtonStyleMixin,
		TResolvedSecondaryBadgeStyleMixin,
		TResolvedNeutralBadgeStyleMixin,
		TResolvedImageStyleMixin,
		TResolvedProductDetailsStyleMixin
	]
>;

export type TResolvedProductNodeMixin<
	GContent extends TResolvedProductNodeContent = TResolvedProductNodeContent
> = TBaseMixin<
	'node',
	{
		type: 'product';
		content: GContent;
	}
>;

export type TResolvedProductNodeContent = TResolvedSingleProductNodeContent;

export interface TResolvedSingleProductNodeContent extends TBaseContentVariant {
	type: 'single';
	product?: TResolvedProduct;
}

export interface TResolvedProduct {
	id: string;
	title: string;
	description?: TRichContent;
	images: TResolvedAsset[];
	options: { name: string; values: string[] }[];
	variants: {
		id: string;
		title: string;
		price: { amount: string; currencyCode: string };
		image?: TResolvedAsset;
		selectedOptions: { name: string; value: string }[];
	}[];
}

import {
	TBaseMixin,
	TIdMixin,
	TNodeComposition,
	TProductNodeMixin,
	TRichContent
} from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBadgeNeutralStyleMixin,
	TResolvedBadgeSecondaryStyleMixin,
	TResolvedButtonPrimaryStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedProductDetailsStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedProductNode = TResolvedSingleProductNodeComposition;

export type TResolvedSingleProductNodeComposition = TNodeComposition<
	TResolvedSingleProductNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TProductNodeMixin,
		TResolvedSingleProductNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin,
		TResolvedButtonPrimaryStyleMixin,
		TResolvedBadgeSecondaryStyleMixin,
		TResolvedBadgeNeutralStyleMixin,
		TResolvedImageStyleMixin,
		TResolvedProductDetailsStyleMixin
	]
>;

export type TResolvedSingleProductNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		product?: TResolvedProduct;
	}
>;

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

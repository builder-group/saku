import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTypographyStyleMixin
} from '../../mixins';

export type TResolvedProductNode = TBaseNode<
	TResolvedProductNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTypographyStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedProductNodeMixin = TMixin<
	'node',
	{
		type: 'product';
		content: {
			product?: TResolvedProduct;
		};
	}
>;

export interface TResolvedProduct {
	id: string;
	title: string;
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

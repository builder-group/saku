import { TBaseMixin, TRichContent } from '@repo/editor';
import { TResolvedAsset } from '../../lib';

export type TResolvedSingleProductNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		product?: TResolvedProduct;
		banner?: {
			label: string;
		};
	}
>;

export interface TResolvedProduct {
	id: string;
	title: string;
	description?: TRichContent;
	images: TResolvedAsset[];
	options: { name: string; values: string[] }[];
	variants: TResolvedProductVariant[];
}

export interface TResolvedProductVariant {
	id: string;
	title: string;
	price: { amount: string; currencyCode: string };
	image?: TResolvedAsset;
	selectedOptions: { name: string; value: string }[];
}

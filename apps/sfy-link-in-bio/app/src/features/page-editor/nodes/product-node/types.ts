import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
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
		content: {
			product?: TResolvedProduct;
		};
	}
>;

export interface TResolvedProduct {
	id: string;
	title: string;
	images: string[]; // Resolved URL or base64
	options: { name: string; values: string[] }[];
	variants: {
		id: string;
		title: string;
		price: { amount: string; currencyCode: string };
		image?: string; // Resolved URL or base64
		selectedOptions: { name: string; value: string }[];
	}[];
}

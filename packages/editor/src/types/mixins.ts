import { TRgba } from '../lib';
import { TNode, TNodeId } from '../types';
import {
	TAssetHash,
	TFont,
	TIntegrationId,
	TLinkVariant,
	TMedia,
	TPaint,
	TReference,
	TSocialLink
} from './utils';

export interface TMixin<TKey extends string, TValue> {
	key: TKey;
	value: TValue;
}

export type TMergeMixins<TMixins extends TMixin<any, any>[]> = {
	[K in TMixins[number]['key']]: Extract<TMixins[number], { key: K }>['value'];
};

// =========================================================================
// Common
// =========================================================================

export type TIdMixin = TMixin<'id', string>;
export type TChildrenMixin = TMixin<'children', TNode[]>;
export type TFlatChildrenMixin = TMixin<'children', TNodeId[]>;

// =========================================================================
// Content
// =========================================================================

export type TPageContentMixin = TMixin<
	'content',
	{
		metadata: {
			title?: string;
			description?: string;
			image?: TAssetHash;
		};
	}
>;

export type TAboutContentMixin = TMixin<
	'content',
	{
		name: string;
		bio?: string;
		profilePicture?: TAssetHash;
		socialLinks: TSocialLink[];
	}
>;

export type TLinkContentMixin = TMixin<
	'content',
	{
		url: string;
		variant: TLinkVariant;
	}
>;

export type TMediaContentMixin = TMixin<
	'content',
	{
		media?: TMedia;
	}
>;

export type TTextContentMixin = TMixin<
	'content',
	{
		text: string;
	}
>;

export type TProductContentMixin = TMixin<
	'content',
	{
		product?: {
			id: string;
			title: string;
			images: TAssetHash[];
			options: { name: string; values: string[] }[];
			variants: {
				id: string;
				title: string;
				price: { amount: string; currencyCode: string };
				image?: TAssetHash;
				selectedOptions: { name: string; value: string }[];
			}[];
		};
		integrationId?: TIntegrationId;
	}
>;

// =========================================================================
// Style
// =========================================================================

export type TFillMixin = TMixin<
	'fill',
	{
		fill: TReference<TPaint>;
	}
>;

export type TLayoutMixin = TMixin<
	'layout',
	{
		padding: TReference<number>;
	}
>;

export type TBorderMixin = TMixin<
	'border',
	{
		radius: TReference<number>;
		width: TReference<number>;
		color: TReference<TRgba>;
	}
>;

export type TShadowMixin = TMixin<
	'shadow',
	{
		color: TReference<TRgba>;
		offsetX: TReference<number>;
		offsetY: TReference<number>;
		blur: TReference<number>;
		spread: TReference<number>;
	}
>;

export type TTypographyMixin = TMixin<
	'typography',
	{
		font: TReference<TFont>;
		fontSize: TReference<number>;
		textColor: TReference<TRgba>;
		textAlign: TReference<'left' | 'center' | 'right'>;
		lineHeight: TReference<number>;
		letterSpacing: TReference<number>;
		fontWeight: TReference<number>;
	}
>;

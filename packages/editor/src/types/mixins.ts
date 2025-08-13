import { TRgba } from '../lib';
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

export type TMergeMixins<TMixins extends readonly TMixin<any, any>[]> = {
	[K in TMixins[number]['key']]: Extract<TMixins[number], { key: K }>['value'];
};

// =========================================================================
// Common
// =========================================================================

export type TIdMixin = TMixin<'id', string>;
export type TVisibleMixin = TMixin<'visible', boolean>;

// =========================================================================
// Content
// =========================================================================

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

export type TTextContentMixin = TMixin<
	'content',
	{
		text: string;
	}
>;

export type TMediaContentMixin = TMixin<
	'content',
	{
		media?: TMedia;
	}
>;

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

// =========================================================================
// Style
// =========================================================================

export type TFillMixin = TMixin<
	'fill',
	{
		fills: TReference<TPaint[]>;
		fillBlendMode: TReference<string>;
	}
>;

export type TLayoutMixin = TMixin<
	'layout',
	{
		padding: TReference<number>;
		width: TReference<number | 'auto'>;
		height: TReference<number | 'auto'>;
		spacing: TReference<number>;
	}
>;

export type TBorderMixin = TMixin<
	'border',
	{
		borderRadius: TReference<number>;
		strokeWidth: TReference<number>;
		stroke: TReference<TPaint>;
		shadow: TReference<{
			color: TRgba;
			offsetX: number;
			offsetY: number;
			blur: number;
			spread: number;
		}>;
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

import { TNode, TNodeId } from './node';
import { TBorderStyle, TFillStyle, TLayoutStyle, TShadowStyle, TTypographyStyle } from './style';
import { TAssetHash, TIntegrationId, TLinkVariant, TMedia, TSocialLink } from './utils';

export interface TMixin<TKey extends string, TValue> {
	key: TKey;
	value: TValue;
}

export type TMergeMixins<TMixins extends TMixin<any, any>[]> = {
	[K in TMixins[number]['key']]: Extract<TMixins[number], { key: K }>['value'];
};

export type TReplaceWithMixins<GBase, GMixins extends TMixin<any, any>[]> = Omit<
	GBase,
	GMixins[number]['key']
> &
	TMergeMixins<[...GMixins]>;

// =========================================================================
// Mixins
// =========================================================================

export type TIdMixin = TMixin<'id', TNodeId>;
export type TChildrenMixin = TMixin<'children', TNode[]>;
export type TFlatChildrenMixin = TMixin<'children', TNodeId[]>;

export type TNodeMixin =
	| TPageNodeMixin
	| TAboutNodeMixin
	| TLinkNodeMixin
	| TMediaNodeMixin
	| TTextNodeMixin
	| TProductNodeMixin;

export type TPageNodeMixin = TMixin<
	'node',
	{
		type: 'page';
		content: {
			metadata: {
				title?: string;
				description?: string;
				image?: TAssetHash;
			};
		};
		style: {
			spacing: number;
		} & TFillStyle;
		childDefaults: {
			style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
		};
	}
>;

export type TAboutNodeMixin = TMixin<
	'node',
	{
		type: 'about';
		content: {
			name: string;
			bio?: string;
			profilePicture?: TAssetHash;
			socialLinks: TSocialLink[];
		};
		style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
	}
>;

export type TLinkNodeMixin = TMixin<
	'node',
	{
		type: 'link';
		content: {
			url: string;
			variant: TLinkVariant;
		};
		style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
	}
>;

export type TMediaNodeMixin = TMixin<
	'node',
	{
		type: 'media';
		content: {
			media?: TMedia;
		};
		style: TFillStyle & TLayoutStyle & TBorderStyle & TShadowStyle;
	}
>;

export type TTextNodeMixin = TMixin<
	'node',
	{
		type: 'text';
		content: {
			text: string;
		};
		style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
	}
>;

export type TProductNodeMixin = TMixin<
	'node',
	{
		type: 'product';
		content: {
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
		};
		style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
	}
>;

import { TRgba } from '../lib';
import { TNode, TNodeId } from './node';
import {
	TAssetHash,
	TFont,
	TIntegrationId,
	TLinkVariant,
	TMedia,
	TPaint,
	TReference,
	TSocialLink,
	TUnreferenceAll
} from './utils';

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
// Common Mixins
// =========================================================================

export type TIdMixin = TMixin<'id', TNodeId>;
export type TChildrenMixin = TMixin<'children', TNode[]>;
export type TFlatChildrenMixin = TMixin<'children', TNodeId[]>;

// =========================================================================
// Node Mixins
// =========================================================================

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
		childDefaults: TUnreferenceAll<
			TMergeMixins<
				[
					TLayoutStyleMixin,
					TFillStyleMixin,
					TTypographyStyleMixin,
					TAppearanceStyleMixin,
					TStrokeStyleMixin,
					TShadowStyleMixin
				]
			>
		>;
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
	}
>;

export type TMediaNodeMixin = TMixin<
	'node',
	{
		type: 'media';
		content: {
			media?: TMedia;
		};
	}
>;

export type TTextNodeMixin = TMixin<
	'node',
	{
		type: 'text';
		content: {
			text: string;
		};
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
	}
>;

// =========================================================================
// Style Mixins
// =========================================================================

export type TLayoutStyleMixin = TMixin<
	'layout',
	{
		padding: TReference<number>;
		spacing: TReference<number>;
	}
>;

export type TAppearanceStyleMixin = TMixin<
	'appearance',
	{
		borderRadius: TReference<number>;
		opacity: TReference<number>;
	}
>;

export type TTypographyStyleMixin = TMixin<
	'typography',
	{
		font: TReference<TFont>;
		fontSize: TReference<number>;
		textColor: TReference<TRgba>;
		textAlign: TReference<'left' | 'center' | 'right'>;
		lineHeight: TReference<number | 'auto'>;
		letterSpacing: TReference<number | 'auto'>;
	}
>;

export type TFillStyleMixin = TMixin<
	'fill',
	TReference<
		| {
				paint: TPaint;
				opacity: number;
		  }
		| false
	>
>;

export type TStrokeStyleMixin = TMixin<
	'stroke',
	TReference<
		| {
				width: number;
				color: TRgba;
		  }
		| false
	>
>;

export type TShadowStyleMixin = TMixin<
	'shadow',
	TReference<
		| {
				color: TRgba;
				offsetX: number;
				offsetY: number;
				blur: number;
				spread: number;
		  }
		| false
	>
>;

import { TReference, TRgba, TUnreference } from '../lib';
import { TNode, TNodeId } from './node';
import {
	TAssetHash,
	TContent,
	TFont,
	TIntegrationId,
	TLetterSpacing,
	TLineHeight,
	TLinkVariant,
	TMedia,
	TPaint,
	TSocialLink,
	TTextAlign
} from './utils';

export interface TMixin<GKey extends string, GValue> {
	key: GKey;
	value: GValue;
}

export type TMergeMixins<GMixins extends TMixin<any, any>[]> = {
	[K in GMixins[number]['key']]: Extract<GMixins[number], { key: K }>['value'];
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
		childMixins: TMergeMixins<
			[
				TUnreference<TLayoutStyleMixin>,
				TUnreference<TAppearanceStyleMixin>,
				TUnreference<TTypographyStyleMixin>,
				TUnreference<TFillStyleMixin>,
				TUnreference<TStrokeStyleMixin>,
				TUnreference<TShadowStyleMixin>
			]
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

export type TLinkNodeMixin<GVariant extends TLinkVariant = TLinkVariant> = TMixin<
	'node',
	{
		type: 'link';
		content: {
			url: string;
			variant: GVariant;
		};
	}
>;

export type TMediaNodeMixin<GMedia extends TMedia = TMedia> = TMixin<
	'node',
	{
		type: 'media';
		content: {
			media?: GMedia;
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
				description?: TContent;
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

export type TCardStyleMixin = TMixin<
	'card',
	{
		layout: TLayoutStyleMixin['value'];
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}
>;

export type TPageStyleMixin = TMixin<
	'page',
	{
		layout: TPageLayoutStyleMixin['value'];
		fill: TFillStyleMixin['value'];
	}
>;

export type TCTAStyleMixin = TMixin<
	'cta',
	{
		layout: TLayoutStyleMixin['value'];
		appearance: TAppearanceStyleMixin['value'];
		typography: TTypographyStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}
>;

export type TTextStyleMixin = TMixin<
	'text',
	{
		typography: TTypographyStyleMixin['value'];
	}
>;

export type TLayoutStyleMixin = TMixin<
	'layout',
	{
		padding: TReference<number>;
	}
>;

export type TPageLayoutStyleMixin = TMixin<
	'layout',
	{
		spacing: number;
	}
>;

export type TAppearanceStyleMixin = TMixin<
	'appearance',
	{
		borderRadius: TReference<number>;
		opacity: TReference<number>;
		visible: boolean;
	}
>;

export type TTypographyStyleMixin = TMixin<
	'typography',
	{
		font: TReference<TFont>;
		fontSize: TReference<number>;
		textColor: TReference<TRgba>;
		textAlign: TReference<TTextAlign>;
		lineHeight: TReference<TLineHeight>;
		letterSpacing: TReference<TLetterSpacing>;
	}
>;

export type TFillStyleMixin = TMixin<
	'fill',
	TReference<{
		paint: TPaint;
		opacity: number; // Note: Only really needed when we support multiple fills - currently same as appearance opacity
	} | null>
>;

export type TStrokeStyleMixin = TMixin<
	'stroke',
	TReference<{
		width: number;
		color: TRgba;
	} | null>
>;

export type TShadowStyleMixin = TMixin<
	'shadow',
	TReference<{
		color: TRgba;
		offsetX: number;
		offsetY: number;
		blur: number;
		spread: number;
	} | null>
>;

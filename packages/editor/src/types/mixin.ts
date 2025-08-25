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
				TUnreference<TAutoLayoutStyleMixin>,
				TUnreference<TAppearanceStyleMixin>,
				TUnreference<TFillStyleMixin>,
				TUnreference<TStrokeStyleMixin>,
				TUnreference<TShadowStyleMixin>,
				TUnreference<TTextStyleMixin>,
				TUnreference<TButtonStyleMixin>
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

// export type TAutoLayoutStyleMixin = TMixin<
// 	'layout',
// 	{
// 		width: number;
// 		height: number;
// 		clipContent?: boolean;
// 	}
// >;

export type TAutoLayoutStyleMixin = TMixin<
	'autoLayout',
	{
		horizontalPadding?: TReference<number>;
		verticalPadding?: TReference<number>;
		horizontalGap?: TReference<number>;
		verticalGap?: TReference<number>;
	}
>;

export type TAppearanceStyleMixin = TMixin<
	'appearance',
	{
		visible: boolean;
		opacity: TReference<number>;
		borderRadius?: TReference<number>;
	}
>;

export type TTypographyStyleMixin = TMixin<
	'typography',
	{
		font: TReference<TFont>;
		fontSize: TReference<number>;
		textAlignHorizontal: TReference<TTextAlign>;
		textAlignVertical: TReference<TTextAlign>;
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

export type TTextStyleMixin = TMixin<
	'text',
	{
		appearance: TAppearanceStyleMixin['value'];
		typography: TTypographyStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}
>;

export type TButtonStyleMixin = TMixin<
	'button',
	{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}
>;

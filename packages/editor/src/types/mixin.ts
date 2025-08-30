import { TRgba } from '../lib';
import { TNode, TNodeId } from './node';
import { TRef } from './ref';
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

export interface TBaseMixin<GKey extends string, GValue> {
	key: GKey;
	value: GValue;
}

export type TMergeMixins<GMixins extends TBaseMixin<any, any>[]> = {
	[K in GMixins[number]['key']]: Extract<GMixins[number], { key: K }>['value'];
};

export type TReplaceWithMixins<GBase, GMixins extends TBaseMixin<any, any>[]> = Omit<
	GBase,
	GMixins[number]['key']
> &
	TMergeMixins<[...GMixins]>;

// =========================================================================
// Common Mixins
// =========================================================================

export type TIdMixin = TBaseMixin<'id', TNodeId>;
export type TChildrenMixin = TBaseMixin<'children', TNode[]>;
export type TFlatChildrenMixin = TBaseMixin<'children', TNodeId[]>;

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

export type TPageNodeMixin = TBaseMixin<
	'node',
	{
		type: 'page';
		content: {
			metadata: {
				title?: string;
				description?: string;
				favicon?: TAssetHash;
				image?: TAssetHash;
			};
		};
	}
>;

export type TAboutNodeMixin = TBaseMixin<
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

export type TLinkNodeMixin<GVariant extends TLinkVariant = TLinkVariant> = TBaseMixin<
	'node',
	{
		type: 'link';
		content: {
			url: string;
			variant: GVariant;
		};
	}
>;

export type TMediaNodeMixin<GMedia extends TMedia = TMedia> = TBaseMixin<
	'node',
	{
		type: 'media';
		content: {
			media?: GMedia;
		};
	}
>;

export type TTextNodeMixin = TBaseMixin<
	'node',
	{
		type: 'text';
		content: {
			text: string;
		};
	}
>;

export type TProductNodeMixin = TBaseMixin<
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

// export type TAutoLayoutStyleMixin = TBaseMixin<
// 	'layout',
// 	{
// 		width: number;
// 		height: number;
// 		clipContent?: boolean;
// 	}
// >;

export type TAutoLayoutStyleMixin = TBaseMixin<
	'autoLayout',
	{
		horizontalPadding?: TRef<number>;
		verticalPadding?: TRef<number>;
		horizontalGap?: TRef<number>;
		verticalGap?: TRef<number>;
	}
>;

export type TAppearanceStyleMixin = TBaseMixin<
	'appearance',
	{
		visible: boolean;
		opacity: TRef<number>;
		borderRadius?: TRef<number>;
	}
>;

export type TTypographyStyleMixin = TBaseMixin<
	'typography',
	{
		font: TRef<TFont>;
		fontSize: TRef<number>;
		textAlignHorizontal: TRef<TTextAlign>;
		textAlignVertical: TRef<TTextAlign>;
		lineHeight: TRef<TLineHeight>;
		letterSpacing: TRef<TLetterSpacing>;
	}
>;

export type TFillStyleMixin = TBaseMixin<
	'fill',
	TRef<{
		paint: TPaint;
		opacity: number; // Note: Only really needed when we support multiple fills - currently same as appearance opacity
	} | null>
>;

export type TStrokeStyleMixin = TBaseMixin<
	'stroke',
	TRef<{
		width: number;
		color: TRgba;
	} | null>
>;

export type TShadowStyleMixin = TBaseMixin<
	'shadow',
	TRef<{
		color: TRgba;
		offsetX: number;
		offsetY: number;
		blur: number;
		spread: number;
	} | null>
>;

export type TTextStyleMixin = TBaseMixin<
	'text',
	{
		appearance: TAppearanceStyleMixin['value'];
		typography: TTypographyStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}
>;

export type TButtonStyleMixin = TBaseMixin<
	'button',
	{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}
>;
export type TPrimaryButtonStyleMixin = TBaseMixin<'primaryButton', TButtonStyleMixin['value']>;
export type TSecondaryButtonStyleMixin = TBaseMixin<'secondaryButton', TButtonStyleMixin['value']>;

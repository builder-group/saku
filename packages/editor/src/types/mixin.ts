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

export interface TBaseNodeVariant {
	type: string;
}

export type TNodeMixin =
	| TPageNodeMixin
	| TAboutNodeMixin
	| TLinkNodeMixin
	| TMediaNodeMixin
	| TTextNodeMixin
	| TProductNodeMixin;

export type TPageNodeMixin<GVariant extends TPageNodeVariant = TPageNodeVariant> = TBaseMixin<
	'node',
	{
		type: 'page';
		content: GVariant;
		metadata: {
			title?: string;
			description?: string;
			favicon?: TAssetHash;
			image?: TAssetHash;
		};
	}
>;

export type TPageNodeVariant = TDefaultPageNodeVariant;

export interface TDefaultPageNodeVariant extends TBaseNodeVariant {
	type: 'default';
}

export type TAboutNodeMixin<GVariant extends TAboutNodeVariant = TAboutNodeVariant> = TBaseMixin<
	'node',
	{
		type: 'about';
		content: GVariant;
	}
>;

export type TAboutNodeVariant = TDefaultAboutNodeVariant;

export interface TDefaultAboutNodeVariant extends TBaseNodeVariant {
	type: 'default';
	name: string;
	bio?: string;
	profilePicture?: TAssetHash;
	socialLinks: TSocialLink[];
}

export type TLinkNodeMixin<GVariant extends TLinkNodeVariant = TLinkNodeVariant> = TBaseMixin<
	'node',
	{
		type: 'link';
		content: GVariant;
	}
>;

export type TLinkNodeVariant =
	| TSingleLinkNodeVariant
	| TYouTubeVideoEmbedNodeVariant
	| TMultiLinkNodeVariant;

export interface TSingleLinkNodeVariant extends TBaseNodeVariant {
	type: 'single';
	url: string;
	// User overrides (take priority)
	userTitle?: string;
	userDescription?: string;
	userFavicon?: TAssetHash | null; // null = explicitly removed, undefined = not set
	// Source metadata (fallback)
	title?: string;
	description?: string;
	favicon?: TAssetHash;
}

export interface TYouTubeVideoEmbedNodeVariant extends TBaseNodeVariant {
	type: 'youtube-video-embed';
	url: string;
	videoId: string;
}

export interface TMultiLinkNodeVariant extends TBaseNodeVariant {
	type: 'multi';
	title?: string;
	links: {
		url: string;
		title?: string;
		description?: string;
		favicon?: TAssetHash;
	}[];
}

export type TMediaNodeMixin<GVariant extends TMediaNodeVariant = TMediaNodeVariant> = TBaseMixin<
	'node',
	{
		type: 'media';
		content: GVariant;
	}
>;

export type TMediaNodeVariant = TImageMediaNodeVariant | TVideoMediaNodeVariant;

export interface TImageMediaNodeVariant extends TBaseNodeVariant {
	type: 'image';
	media?: {
		hash: TAssetHash;
		altText?: string;
	};
}

export interface TVideoMediaNodeVariant extends TBaseNodeVariant {
	type: 'video';
	media?: {
		hash: TAssetHash;
		autoplay?: boolean;
		muted?: boolean;
		controls?: boolean;
	};
}

export type TTextNodeMixin<GVariant extends TTextNodeVariant = TTextNodeVariant> = TBaseMixin<
	'node',
	{
		type: 'text';
		content: GVariant;
	}
>;

export type TTextNodeVariant = TPlainTextNodeVariant;

export interface TPlainTextNodeVariant extends TBaseNodeVariant {
	type: 'plain';
	text: string;
}

export type TProductNodeMixin<GVariant extends TProductNodeVariant = TProductNodeVariant> =
	TBaseMixin<
		'node',
		{
			type: 'product';
			content: GVariant;
		}
	>;

export type TProductNodeVariant = TSingleProductNodeVariant;

export interface TSingleProductNodeVariant extends TBaseNodeVariant {
	type: 'single';
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
}

// =========================================================================
// Style Mixins
// =========================================================================

// export type TLayoutStyleMixin = TBaseMixin<
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

export type TCardStyleMixin = TBaseMixin<
	'card',
	{
		autoLayout: TAutoLayoutStyleMixin['value'];
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}
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
export type THeadingStyleMixin = TBaseMixin<'headingText', TTextStyleMixin['value']>;

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

export type TBadgeStyleMixin = TBaseMixin<
	'badge',
	{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}
>;

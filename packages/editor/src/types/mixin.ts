import { TRgba } from '../lib';
import { TNode, TNodeId } from './node';
import { TRef } from './ref';
import {
	TAssetHash,
	TFont,
	TIntegrationId,
	TLetterSpacing,
	TLineHeight,
	TPaint,
	TRichContent,
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

export interface TBaseContentVariant {
	type: string;
}

export type TNodeMixin =
	| TPageNodeMixin
	| TAboutNodeMixin
	| TLinkNodeMixin
	| TMediaNodeMixin
	| TTextNodeMixin
	| TProductNodeMixin;

export type TPageNodeMixin<GContent extends TPageNodeContent = TPageNodeContent> = TBaseMixin<
	'node',
	{
		type: 'page';
		content: GContent;
		metadata: {
			title?: string;
			description?: string;
			favicon?: TAssetHash;
			image?: TAssetHash;
		};
	}
>;

export type TPageNodeContent = TDefaultPageNodeContent;

export interface TDefaultPageNodeContent extends TBaseContentVariant {
	type: 'default';
}

export type TAboutNodeMixin<GContent extends TAboutNodeContent = TAboutNodeContent> = TBaseMixin<
	'node',
	{
		type: 'about';
		content: GContent;
	}
>;

export type TAboutNodeContent = TDefaultAboutNodeContent;

export interface TDefaultAboutNodeContent extends TBaseContentVariant {
	type: 'default';
	name: string;
	bio?: string;
	profilePicture?: TAssetHash;
	socialLinks: TSocialLink[];
}

// export interface THeroAboutNodeVariant extends TBaseNodeVariant {
// 	type: 'hero'; // big headline → description → small profile picture
// 	headline: string;
// 	description?: string;
// 	name?: string;
// 	profilePicture?: TAssetHash;
// 	callToAction?: {
// 		label: string;
// 		action: TAction;
// 	};
// }

export type TLinkNodeMixin<GContent extends TLinkNodeContent = TLinkNodeContent> = TBaseMixin<
	'node',
	{
		type: 'link';
		content: GContent;
	}
>;

export type TLinkNodeContent = TSingleLinkNodeContent | TYouTubeVideoEmbedLinkNodeContent;

export interface TSingleLinkNodeContent extends TBaseContentVariant {
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

export interface TYouTubeVideoEmbedLinkNodeContent extends TBaseContentVariant {
	type: 'youtube-video-embed';
	url: string;
	videoId: string;
}

// export interface TMultiLinkNodeContent extends TBaseContentVariant {
// 	type: 'multi';
// 	title?: string;
// 	links: {
// 		url: string;
// 		title?: string;
// 		description?: string;
// 		favicon?: TAssetHash;
// 	}[];
// }

export type TMediaNodeMixin<GContent extends TMediaNodeContent = TMediaNodeContent> = TBaseMixin<
	'node',
	{
		type: 'media';
		content: GContent;
	}
>;

export type TMediaNodeContent = TImageMediaNodeContent;

export interface TImageMediaNodeContent extends TBaseContentVariant {
	type: 'image';
	media?: {
		hash: TAssetHash;
		altText?: string;
	};
}

// export interface TVideoMediaNodeVariant extends TBaseNodeVariant {
// 	type: 'video';
// 	media?: {
// 		hash: TAssetHash;
// 		autoplay?: boolean;
// 		muted?: boolean;
// 		controls?: boolean;
// 	};
// }

export type TTextNodeMixin<GContent extends TTextNodeContent = TTextNodeContent> = TBaseMixin<
	'node',
	{
		type: 'text';
		content: GContent;
	}
>;

export type TTextNodeContent = TDefaultTextNodeContent;

export interface TDefaultTextNodeContent extends TBaseContentVariant {
	type: 'default';
	text: TRichContent;
}

export type TProductNodeMixin<GContent extends TProductNodeContent = TProductNodeContent> =
	TBaseMixin<
		'node',
		{
			type: 'product';
			content: GContent;
		}
	>;

export type TProductNodeContent = TSingleProductNodeContent;

export interface TSingleProductNodeContent extends TBaseContentVariant {
	type: 'single';
	product?: TProduct;
	integrationId?: TIntegrationId;
}

export interface TProduct {
	id: string;
	title: string;
	description?: TRichContent;
	images: TAssetHash[];
	options: { name: string; values: string[] }[];
	variants: {
		id: string;
		title: string;
		price: { amount: string; currencyCode: string };
		image?: TAssetHash;
		selectedOptions: { name: string; value: string }[];
	}[];
}

// =========================================================================
// Style Mixins
// =========================================================================

export type TStyleMixin =
	| TAutoLayoutStyleMixin
	| TAppearanceStyleMixin
	| TTypographyStyleMixin
	| TFillStyleMixin
	| TStrokeStyleMixin
	| TShadowStyleMixin
	| TTextStyleMixin
	| TButtonStyleMixin
	| TBadgeStyleMixin
	| TImageStyleMixin
	| TProductDetailsStyleMixin;

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
		horizontalPadding: TRef<number>;
		verticalPadding: TRef<number>;
		horizontalGap: TRef<number> | undefined;
		verticalGap: TRef<number> | undefined;
	}
>;

export type TAppearanceStyleMixin = TBaseMixin<
	'appearance',
	{
		visible: boolean;
		opacity: TRef<number>;
		borderRadius: TRef<number> | undefined;
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

// =========================================================================
// Composed Style Mixins
// =========================================================================

// export type TCardStyleMixin = TBaseMixin<
// 	'card',
// 	{
// 		autoLayout: TAutoLayoutStyleMixin['value'];
// 		appearance: TAppearanceStyleMixin['value'];
// 		fill: TFillStyleMixin['value'];
// 		stroke: TStrokeStyleMixin['value'];
// 		shadow: TShadowStyleMixin['value'];
// 	}
// >;

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
export type TXlTextStyleMixin = TBaseMixin<'xlText', TTextStyleMixin['value']>;
export type TSmTextStyleMixin = TBaseMixin<'smText', TTextStyleMixin['value']>;

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
export type TNeutralButtonStyleMixin = TBaseMixin<'neutralButton', TButtonStyleMixin['value']>;

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
export type TPrimaryBadgeStyleMixin = TBaseMixin<'primaryBadge', TBadgeStyleMixin['value']>;
export type TNeutralBadgeStyleMixin = TBaseMixin<'neutralBadge', TBadgeStyleMixin['value']>;

export type TImageStyleMixin = TBaseMixin<
	'image',
	{
		appearance: TAppearanceStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}
>;

export type TProductDetailsStyleMixin = TBaseMixin<
	'productDetails',
	{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		xlText: TXlTextStyleMixin['value'];
		text: TTextStyleMixin['value'];
		primaryButton: TPrimaryButtonStyleMixin['value'];
		image: TImageStyleMixin['value'];
	}
>;

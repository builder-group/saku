import { TRgba } from '../lib';
import { TNode, TNodeId } from './node';
import { TRef } from './ref';
import { TAutoLayoutStyleToken } from './token';
import {
	TAssetHash,
	TEmailAction,
	TFont,
	TIntegrationId,
	TLetterSpacing,
	TLineHeight,
	TPaint,
	TPhoneAction,
	TRichContent,
	TSocialAction,
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
	hasWatermark: boolean;
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
	contactIcons: TContactIcon[];
}

export interface TContactIcon {
	id: string;
	action: TEmailAction | TPhoneAction | TSocialAction;
	title?: string;
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

export type TLinkNodeContent =
	| TSingleLinkNodeContent
	| TYouTubeEmbedLinkNodeContent
	| TSpotifyEmbedLinkNodeContent;

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

export interface TYouTubeEmbedLinkNodeContent extends TBaseContentVariant {
	type: 'youtube-embed';
	url: string;
	contentType: TYouTubeEmbedContentType;
	contentId: string;
}
export type TYouTubeEmbedContentType = 'video' | 'playlist';

export interface TSpotifyEmbedLinkNodeContent extends TBaseContentVariant {
	type: 'spotify-embed';
	url: string;
	contentType: TSpotifyEmbedContentType;
	contentId: string;
	height: number; // normal = 352px, compact = 152px
	theme?: TSpotifyEmbedTheme;
}

export interface TSpotifyEmbedTheme {
	backgroundBase?: TRgba;
	backgroundTinted?: TRgba;
	textBase?: TRgba;
	textSubdued?: TRgba;
}
export type TSpotifyEmbedContentType = 'track' | 'album' | 'playlist' | 'artist';

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
	TRef<
		{
			horizontalPadding: TRef<number>;
			verticalPadding: TRef<number>;
			horizontalGap: TRef<number | null>;
			verticalGap: TRef<number | null>;
		},
		TAutoLayoutStyleToken
	>
>;

export type TAppearanceStyleMixin = TBaseMixin<
	'appearance',
	TRef<{
		visible: TRef<boolean>;
		opacity: TRef<number>;
		borderRadius: TRef<number | null>;
	}>
>;

export type TTypographyStyleMixin = TBaseMixin<
	'typography',
	TRef<{
		font: TRef<TFont>;
		fontSize: TRef<number>;
		textAlignHorizontal: TRef<TTextAlign>;
		textAlignVertical: TRef<TTextAlign>;
		lineHeight: TRef<TLineHeight>;
		letterSpacing: TRef<TLetterSpacing>;
	}>
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

export type TCardStyleMixin = TBaseMixin<
	'card',
	TRef<{
		autoLayout: TAutoLayoutStyleMixin['value'];
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;

export type TTextStyleMixin = TBaseMixin<
	'text',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		typography: TTypographyStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;
export type TTextXlStyleMixin = TBaseMixin<'textXl', TTextStyleMixin['value']>;
export type TTextSmStyleMixin = TBaseMixin<'textSm', TTextStyleMixin['value']>;

export type TButtonStyleMixin = TBaseMixin<
	'button',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}>
>;
export type TButtonPrimaryStyleMixin = TBaseMixin<'buttonPrimary', TButtonStyleMixin['value']>;
export type TButtonNeutralStyleMixin = TBaseMixin<'buttonNeutral', TButtonStyleMixin['value']>;

export type TBadgeStyleMixin = TBaseMixin<
	'badge',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}>
>;
export type TBadgeSecondaryStyleMixin = TBaseMixin<'badgeSecondary', TBadgeStyleMixin['value']>;
export type TBadgeNeutralStyleMixin = TBaseMixin<'badgeNeutral', TBadgeStyleMixin['value']>;

export type TImageStyleMixin = TBaseMixin<
	'image',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;

export type TProductDetailsStyleMixin = TBaseMixin<
	'productDetails',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		textXl: TTextXlStyleMixin['value'];
		text: TTextStyleMixin['value'];
		buttonPrimary: TButtonPrimaryStyleMixin['value'];
		image: TImageStyleMixin['value'];
	}>
>;

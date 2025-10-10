import { TId, TRgba } from '../lib';
import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeNeutralStyleMixin,
	TBadgeSecondaryStyleMixin,
	TBaseMixin,
	TButtonPrimaryStyleMixin,
	TChildrenMixin,
	TFillStyleMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TImageStyleMixin,
	TMergeMixins,
	TProductDetailsStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextSmStyleMixin,
	TTextStyleMixin,
	TTextXlStyleMixin
} from './mixin';
import {
	TAssetHash,
	TEmailAction,
	TIntegrationId,
	TPhoneAction,
	TRichContent,
	TSocialAction
} from './utils';

export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode | TProductNode;
export type TFlatNode =
	| TFlatPageNode
	| TAboutNode
	| TLinkNode
	| TMediaNode
	| TTextNode
	| TProductNode;

export type TNodeId = TId<'node'>;

export type TNodeComposition<GKey extends string, GMixins extends TBaseMixin<any, any>[]> = {
	composition: GKey;
} & Extract<GMixins[number], { key: 'node' }>['value'] &
	Omit<TMergeMixins<GMixins>, 'node'>;

// =========================================================================
// Page Node
// =========================================================================

export type TPageNode = TDefaultPageComposition;
export type TFlatPageNode = TDefaultFlatPageComposition;

export type TDefaultPageComposition = TNodeComposition<
	'default',
	[
		TIdMixin,
		TPageNodeMixin,
		TChildrenMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin
	]
>;
export type TDefaultFlatPageComposition = TNodeComposition<
	'default', // Use 'default' (instead of e.g. 'flat') to match variant naming across flat/regular contexts (e.g., 'elevated' would be 'elevated' in both)
	[
		TIdMixin,
		TPageNodeMixin,
		TFlatChildrenMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin
	]
>;

export type TPageNodeMixin = TBaseMixin<
	'node',
	{
		type: 'page';
		metadata: {
			title?: string;
			description?: string;
			favicon?: TAssetHash;
			image?: TAssetHash;
		};
		hasWatermark: boolean;
	}
>;

// =========================================================================
// About Node
// =========================================================================

export type TAboutNode = TDefaultAboutComposition;

export type TDefaultAboutComposition = TNodeComposition<
	TDefaultAboutContentMixin['value']['type'],
	[
		TIdMixin,
		TAboutNodeMixin,
		TDefaultAboutContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextXlStyleMixin,
		TTextStyleMixin,
		TImageStyleMixin
	]
>;

export type TAboutNodeMixin = TBaseMixin<
	'node',
	{
		type: 'about';
	}
>;

export type TDefaultAboutContentMixin = TBaseMixin<
	'content',
	{
		type: 'default';
		name: string;
		bio?: string;
		profilePicture?: TAssetHash;
		contactIcons: TContactIcon[];
	}
>;

export interface TContactIcon {
	id: string;
	action: TEmailAction | TPhoneAction | TSocialAction;
	title?: string;
}

// =========================================================================
// Link Node
// =========================================================================

export type TLinkNode =
	| TSingleLinkComposition
	| TYouTubeEmbedLinkComposition
	| TSpotifyEmbedLinkComposition;

export type TSingleLinkComposition = TNodeComposition<
	TSingleLinkContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TSingleLinkContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin,
		TTextSmStyleMixin,
		TImageStyleMixin
	]
>;
export type TYouTubeEmbedLinkComposition = TNodeComposition<
	TYouTubeEmbedLinkContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TYouTubeEmbedLinkContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;
export type TSpotifyEmbedLinkComposition = TNodeComposition<
	TSpotifyEmbedLinkContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TSpotifyEmbedLinkContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;

export type TLinkNodeMixin = TBaseMixin<
	'node',
	{
		type: 'link';
	}
>;

export type TSingleLinkContentMixin = TBaseMixin<
	'content',
	{
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
>;

export type TYouTubeEmbedLinkContentMixin = TBaseMixin<
	'content',
	{
		type: 'youtube-embed';
		url: string;
		contentType: TYouTubeEmbedContentType;
		contentId: string;
	}
>;

export type TYouTubeEmbedContentType = 'video' | 'playlist';

export type TSpotifyEmbedLinkContentMixin = TBaseMixin<
	'content',
	{
		type: 'spotify-embed';
		url: string;
		contentType: TSpotifyEmbedContentType;
		contentId: string;
		height: number; // normal = 352px, compact = 152px
		theme?: TSpotifyEmbedTheme;
	}
>;

export interface TSpotifyEmbedTheme {
	backgroundBase?: TRgba;
	backgroundTinted?: TRgba;
	textBase?: TRgba;
	textSubdued?: TRgba;
}

export type TSpotifyEmbedContentType = 'track' | 'album' | 'playlist' | 'artist';

// =========================================================================
// Media Node
// =========================================================================

export type TMediaNode = TImageMediaComposition;

export type TImageMediaComposition = TNodeComposition<
	TImageMediaContentMixin['value']['type'],
	[
		TIdMixin,
		TMediaNodeMixin,
		TImageMediaContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TImageStyleMixin
	]
>;

export type TMediaNodeMixin = TBaseMixin<
	'node',
	{
		type: 'media';
	}
>;

export type TImageMediaContentMixin = TBaseMixin<
	'content',
	{
		type: 'image';
		media?: {
			hash: TAssetHash;
			altText?: string;
		};
	}
>;

// =========================================================================
// Text Node
// =========================================================================

export type TTextNode = TDefaultTextComposition;

export type TDefaultTextComposition = TNodeComposition<
	TDefaultTextContentMixin['value']['type'],
	[
		TIdMixin,
		TTextNodeMixin,
		TDefaultTextContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin
	]
>;

export type TTextNodeMixin = TBaseMixin<
	'node',
	{
		type: 'text';
	}
>;

export type TDefaultTextContentMixin = TBaseMixin<
	'content',
	{
		type: 'default';
		text: TRichContent;
	}
>;

// =========================================================================
// Product Node
// =========================================================================

export type TProductNode = TSingleProductComposition;

export type TSingleProductComposition = TNodeComposition<
	TSingleProductContentMixin['value']['type'],
	[
		TIdMixin,
		TProductNodeMixin,
		TSingleProductContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin,
		TButtonPrimaryStyleMixin,
		TBadgeSecondaryStyleMixin,
		TBadgeNeutralStyleMixin,
		TImageStyleMixin,
		TProductDetailsStyleMixin
	]
>;

export type TProductNodeMixin = TBaseMixin<
	'node',
	{
		type: 'product';
	}
>;

export type TSingleProductContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		product?: TProduct;
		integrationId?: TIntegrationId;
	}
>;

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

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

export type TAboutNode = TDefaultAboutNodeComposition;

export type TDefaultAboutNodeComposition = TNodeComposition<
	TDefaultAboutNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TAboutNodeMixin,
		TDefaultAboutNodeContentMixin,
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

export type TDefaultAboutNodeContentMixin = TBaseMixin<
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
	| TSingleLinkNodeComposition
	| TYouTubeEmbedLinkNodeComposition
	| TSpotifyEmbedLinkNodeComposition;

export type TSingleLinkNodeComposition = TNodeComposition<
	TSingleLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TSingleLinkNodeContentMixin,
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
export type TYouTubeEmbedLinkNodeComposition = TNodeComposition<
	TYouTubeEmbedLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TYouTubeEmbedLinkNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TImageStyleMixin // TODO: Replace with TEmbedStyleMixin
	]
>;
export type TSpotifyEmbedLinkNodeComposition = TNodeComposition<
	TSpotifyEmbedLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TSpotifyEmbedLinkNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TImageStyleMixin // TODO: Replace with TEmbedStyleMixin
	]
>;

export type TLinkNodeMixin = TBaseMixin<
	'node',
	{
		type: 'link';
	}
>;

export type TSingleLinkNodeContentMixin = TBaseMixin<
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

export type TYouTubeEmbedLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'youtube-embed';
		url: string;
		contentType: TYouTubeEmbedContentType;
		contentId: string;
	}
>;

export type TYouTubeEmbedContentType = 'video' | 'playlist';

export type TSpotifyEmbedLinkNodeContentMixin = TBaseMixin<
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

export type TMediaNode = TImageMediaNodeComposition;

export type TImageMediaNodeComposition = TNodeComposition<
	TImageMediaNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TMediaNodeMixin,
		TImageMediaNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
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

export type TImageMediaNodeContentMixin = TBaseMixin<
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

export type TTextNode = TDefaultTextNodeComposition;

export type TDefaultTextNodeComposition = TNodeComposition<
	TDefaultTextNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TTextNodeMixin,
		TDefaultTextNodeContentMixin,
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

export type TDefaultTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'default';
		text: TRichContent;
	}
>;

// =========================================================================
// Product Node
// =========================================================================

export type TProductNode = TSingleProductNodeComposition;

export type TSingleProductNodeComposition = TNodeComposition<
	TSingleProductNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TProductNodeMixin,
		TSingleProductNodeContentMixin,
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

export type TSingleProductNodeContentMixin = TBaseMixin<
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

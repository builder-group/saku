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

export type TNodeBundle<GType extends string, GMixins extends TBaseMixin<any, any>[]> = {
	bundle: GType;
} &
	// Note: Node mixin is merged at top level (e.g. `node.type` instead of `node.node.type`)
	// to avoid unnecessary nesting. When parsing back to mixins, use destructuring in resolvers
	// since type-safe extraction probably requires node-specific parsing logic anyway.
	Extract<GMixins[number], { key: 'node' }>['value'] &
	Omit<TMergeMixins<GMixins>, 'node'>;

// =========================================================================
// Page Node
// =========================================================================

export type TPageNode = TClassicPageNodeBundle;
export type TFlatPageNode = TClassicFlatPageNodeBundle;

export type TClassicPageNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TPageNodeMixin,
		TChildrenMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin
	]
>;
export type TClassicFlatPageNodeBundle = TNodeBundle<
	'classic', // Use 'classic' (instead of e.g. 'flat-classic') to match variant naming across flat/regular contexts (e.g. 'bento' would be 'bento' in both)
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

export type TAboutNode = TClassicAboutNodeBundle;

export type TClassicAboutNodeBundle = TNodeBundle<
	TClassicAboutNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TAboutNodeMixin,
		TClassicAboutNodeContentMixin,
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

export type TClassicAboutNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'classic';
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
	| TClassicLinkNodeBundle
	| TYouTubeEmbedLinkNodeBundle
	| TSpotifyEmbedLinkNodeBundle;

export type TClassicLinkNodeBundle = TNodeBundle<
	TClassicLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TClassicLinkNodeContentMixin,
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
export type TYouTubeEmbedLinkNodeBundle = TNodeBundle<
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
export type TSpotifyEmbedLinkNodeBundle = TNodeBundle<
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

export type TClassicLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'classic';
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

export type TMediaNode = TImageMediaNodeBundle;

export type TImageMediaNodeBundle = TNodeBundle<
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

export type TTextNode = TMarkdownTextNodeBundle;

export type TMarkdownTextNodeBundle = TNodeBundle<
	TMarkdownTextNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TTextNodeMixin,
		TMarkdownTextNodeContentMixin,
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

export type TMarkdownTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'markdown';
		text: string;
	}
>;

// =========================================================================
// Product Node
// =========================================================================

export type TProductNode = TClassicProductNodeBundle;

export type TClassicProductNodeBundle = TNodeBundle<
	TClassicProductNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TProductNodeMixin,
		TClassicProductNodeContentMixin,
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

export type TClassicProductNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'classic';
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

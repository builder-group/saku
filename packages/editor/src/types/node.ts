import { TId, TRgba } from '../lib';
import {
	TAnimationStyleMixin,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeNeutralStyleMixin,
	TBadgeSecondaryStyleMixin,
	TBannerStyleMixin,
	TBaseMixin,
	TButtonPrimaryStyleMixin,
	TChildrenMixin,
	TEmbedStyleMixin,
	TFillStyleMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TImageStyleMixin,
	TMergeMixins,
	TProductDetailsStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextBodyStyleMixin,
	TTextCaptionStyleMixin,
	TTextHeadingStyleMixin
} from './mixin';
import {
	TAction,
	TAssetHash,
	TEmailAction,
	TIntegrationId,
	TLinkAction,
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

/**
 * Node-specific bundle type for composing node mixins into complete node shapes.
 * This is NOT a general-purpose bundle type - it's tailored for node architecture.
 *
 * @template GType - Bundle type discriminator (e.g., 'classic', 'youtube-embed')
 * @template GMixins - Array of mixins that compose the bundle
 *
 * @remarks
 * **Why bundleType exists:**
 * - Discriminates complete bundle shapes, not just content variants
 * - Enables component registry lookups: `registry[node.type][node.bundleType]`
 * - Bundles can share content types but differ in style mixins
 *
 * **Why node mixin is merged at root:**
 * - `node.type` is the primary discriminator, accessed constantly in switches/guards/registries
 * - Avoids unnecessary nesting: `node.type` vs `node.node.type`
 * - Treats `type` as the node's identity rather than just another composable mixin
 *
 * **Why bundleType is node-specific (not globally unique):**
 * - This is TNodeBundle, not a general bundle type - scoping is specific to nodes
 * - Bundle names are scoped to node types (e.g. 'classic' works for links, text, media)
 * - Keeps names semantic rather than artificially prefixed (e.g., 'classic' vs 'node_link_classic')
 *
 * **Parsing back to mixins:**
 * - Use destructuring in resolvers - node-specific parsing logic probably required anyway
 */
export type TNodeBundle<GType extends string, GMixins extends TBaseMixin<any, any>[]> = {
	bundleType: GType;
} & Extract<GMixins[number], { key: 'node' }>['value'] &
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
		TBasicPageNodeContentMixin,
		TChildrenMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TTextCaptionStyleMixin
	]
>;
export type TClassicFlatPageNodeBundle = TNodeBundle<
	'classic', // Use 'classic' (instead of e.g. 'flat-classic') to match variant naming across flat/regular contexts (e.g. 'bento' would be 'bento' in both)
	[
		TIdMixin,
		TPageNodeMixin,
		TBasicPageNodeContentMixin,
		TFlatChildrenMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TTextCaptionStyleMixin
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
		watermarkVisible: boolean;
	}
>;

export type TBasicPageNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		navbar: {
			visible: boolean;
			shareButtonVisible: boolean;
		};
		footer: {
			visible: boolean;
			links: TFooterLink[];
		};
	}
>;

export interface TFooterLink {
	id: string;
	action: TFooterAction;
	label: string;
}

export type TFooterAction = TAction | TFooterReportAction | TFooterPrivacyAction;

export interface TFooterReportAction {
	type: 'footer-report';
}

export interface TFooterPrivacyAction {
	type: 'footer-privacy';
}

// =========================================================================
// About Node
// =========================================================================

export type TAboutNode = TClassicAboutNodeBundle | THeroAboutNodeBundle;

export type TClassicAboutNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TAboutNodeMixin,
		TBasicAboutNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextHeadingStyleMixin,
		TTextBodyStyleMixin,
		TImageStyleMixin
	]
>;

export type THeroAboutNodeBundle = TNodeBundle<
	'hero',
	[
		TIdMixin,
		TAboutNodeMixin,
		TBasicAboutNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextHeadingStyleMixin,
		TTextBodyStyleMixin
	]
>;

export type TAboutNodeMixin = TBaseMixin<
	'node',
	{
		type: 'about';
	}
>;

export type TBasicAboutNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		title: string;
		description?: string;
		avatar?: TAssetHash;
		contactLinks: TContactLink[];
	}
>;

export interface TContactLink {
	id: string;
	action: TLinkAction | TEmailAction | TPhoneAction | TSocialAction;
	altText?: string;
}

// =========================================================================
// Link Node
// =========================================================================

export type TLinkNode =
	| TClassicLinkNodeBundle
	| TFeaturedLinkNodeBundle
	| TYouTubeEmbedLinkNodeBundle
	| TSpotifyEmbedLinkNodeBundle;

export type TClassicLinkNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TLinkNodeMixin,
		TBasicLinkNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TAnimationStyleMixin,
		TTextBodyStyleMixin,
		TTextCaptionStyleMixin,
		TImageStyleMixin
	]
>;

export type TFeaturedLinkNodeBundle = TNodeBundle<
	'featured',
	[
		TIdMixin,
		TLinkNodeMixin,
		TBasicLinkNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TAnimationStyleMixin,
		TTextBodyStyleMixin,
		TTextCaptionStyleMixin,
		TImageStyleMixin
	]
>;

export type TYouTubeEmbedLinkNodeBundle = TNodeBundle<
	'youtube-embed',
	[
		TIdMixin,
		TLinkNodeMixin,
		TYouTubeEmbedLinkNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TEmbedStyleMixin
	]
>;

export type TSpotifyEmbedLinkNodeBundle = TNodeBundle<
	'spotify-embed',
	[
		TIdMixin,
		TLinkNodeMixin,
		TSpotifyEmbedLinkNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TEmbedStyleMixin
	]
>;

export type TLinkNodeMixin = TBaseMixin<
	'node',
	{
		type: 'link';
	}
>;

export type TBasicLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		url: string;
		metadata?: {
			title?: string;
			description?: string;
			thumbnail?: TAssetHash;
		};
		// User overrides (take priority)
		overrides: {
			title?: string;
			description?: string;
			thumbnail?: TAssetHash | null; // null = explicitly removed, undefined = not set
		};
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

export type TMediaNode = TClassicMediaNodeBundle;

export type TClassicMediaNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TMediaNodeMixin,
		TSingleMediaNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TAnimationStyleMixin,
		TImageStyleMixin
	]
>;

export type TMediaNodeMixin = TBaseMixin<
	'node',
	{
		type: 'media';
	}
>;

export type TSingleMediaNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		media?: {
			type: 'image' | 'video' | 'audio';
			hash: TAssetHash;
			altText?: string;
		};
	}
>;

// =========================================================================
// Text Node
// =========================================================================

export type TTextNode = TRichTextNodeBundle | TSectionTitleTextNodeBundle;

export type TRichTextNodeBundle = TNodeBundle<
	'rich',
	[
		TIdMixin,
		TTextNodeMixin,
		TRichTextNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TAnimationStyleMixin,
		TTextBodyStyleMixin
	]
>;

export type TSectionTitleTextNodeBundle = TNodeBundle<
	'section-title',
	[
		TIdMixin,
		TTextNodeMixin,
		TBasicTextNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TTextHeadingStyleMixin
	]
>;

export type TTextNodeMixin = TBaseMixin<
	'node',
	{
		type: 'text';
	}
>;

export type TRichTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'rich';
		text: TRichContent;
	}
>;

export type TBasicTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		text: string;
	}
>;

// =========================================================================
// Product Node
// =========================================================================

export type TProductNode = TClassicProductNodeBundle | TFeaturedProductNodeBundle;

export type TClassicProductNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TProductNodeMixin,
		TSingleProductNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextBodyStyleMixin,
		TButtonPrimaryStyleMixin,
		TBadgeSecondaryStyleMixin,
		TBadgeNeutralStyleMixin,
		TBannerStyleMixin,
		TImageStyleMixin,
		TProductDetailsStyleMixin
	]
>;

export type TFeaturedProductNodeBundle = TNodeBundle<
	'featured',
	[
		TIdMixin,
		TProductNodeMixin,
		TSingleProductNodeContentMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextBodyStyleMixin,
		TButtonPrimaryStyleMixin,
		TBadgeSecondaryStyleMixin,
		TBadgeNeutralStyleMixin,
		TBannerStyleMixin,
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
		banner?: {
			label: string;
		};
		// cta?: {
		// 	label: string;
		// 	action: TProductCtaAction;
		// };
		// User overrides (take priority)
		overrides: {
			title?: string;
			description?: TRichContent;
		};
		integrationId?: TIntegrationId;
	}
>;

// export type TProductCtaAction = TProductCtaBuyAction | TProductCtaCartAction;

// export interface TProductCtaBuyAction {
// 	type: 'product-cta-buy';
// }

// export interface TProductCtaCartAction {
// 	type: 'product-cta-cart';
// }

// export type TMultiProductNodeContentMixin = TBaseMixin<
// 	'content',
// 	{
// 		type: 'multi';
// 		products: {
// 			product: TProduct;
// 			overrides: {
// 				title?: string;
// 				description?: TRichContent;
// 			};
//         integrationId?: TIntegrationId;
// 		}[];
// 	}
// >;

export interface TProduct {
	id: string;
	title: string;
	description?: TRichContent;
	images: TAssetHash[];
	options: { name: string; values: string[] }[];
	variants: TProductVariant[];
}

export interface TProductVariant {
	id: string;
	title: string;
	price: { amount: string; currencyCode: string };
	image?: TAssetHash;
	selectedOptions: { name: string; value: string }[];
}

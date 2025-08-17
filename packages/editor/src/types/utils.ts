import { TId, TRgba } from '../lib';

// =========================================================================
// Asset
// =========================================================================

export type TAssetId = TId<'asset'>;
export type TAssetHash = string; // & { readonly __brand: 'AssetHash' }; // SHA-256 hash as hex string

export type TAsset = TFontAsset | TImageAsset;

export interface TBaseAsset {
	id: TAssetId;
	type: string;
	hash: TAssetHash; // Content hash
	contentType: string; // MIME type
	fileName?: string;
	size?: number; // bytes
	storage: { type: 'url'; url: string } | { type: 'embedded'; data: string }; // base64
}

export interface TFontAsset extends TBaseAsset {
	type: 'font';
	contentType: 'font/woff' | 'font/woff2' | 'font/ttf' | 'font/otf';
	font: TFont;
}

export interface TImageAsset extends TBaseAsset {
	type: 'image';
	contentType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' | 'image/svg+xml';
	dimensions?: { width: number; height: number };
	altText?: string;
}

// =========================================================================
// Font
// =========================================================================

export interface TFont {
	family: string;
	weight?: number;
	style?: 'normal' | 'italic';
}

export type TTextAlign = 'left' | 'center' | 'right';
export type TLineHeight = number | 'auto';
export type TLetterSpacing = number | 'auto';

// =========================================================================
// Paint
// =========================================================================

export type TPaint = TSolidPaint | TImagePaint;

export interface TBasePaint {
	type: string;
}

export interface TSolidPaint extends TBasePaint {
	type: 'solid';
	color: TRgba;
}

export interface TImagePaint extends TBasePaint {
	type: 'image';
	hash: TAssetHash;
	altText?: string;
}

// =========================================================================
// Link Variant
// =========================================================================

export type TLinkVariant = TDefaultLinkVariant | TYouTubeVideoEmbedVariant;

export interface TBaseLinkVariant {
	type: string;
}

export interface TDefaultLinkVariant extends TBaseLinkVariant {
	type: 'default';
	// User overrides (take priority)
	userTitle?: string;
	userDescription?: string;
	userFavicon?: TAssetHash;
	// Source metadata (fallback)
	title?: string;
	description?: string;
	favicon?: TAssetHash;
}

export interface TYouTubeVideoEmbedVariant extends TBaseLinkVariant {
	type: 'youtube-video-embed';
	videoId: string;
}

// =========================================================================
// Media
// =========================================================================

export type TMedia = TImageMedia;

export interface TImageMedia {
	type: 'image';
	hash: TAssetHash;
	altText?: string;
}

// =========================================================================
// Social Links
// =========================================================================

export interface TSocialLink {
	id: string;
	provider:
		| 'instagram'
		| 'twitter'
		| 'youtube'
		| 'tiktok'
		| 'linkedin'
		| 'facebook'
		| 'shopify'
		| 'bluesky'
		| 'discord'
		| 'github'
		| 'google'
		| 'spotify'
		| 'pinterest';
	handle: string;
	url?: string;
}

// =========================================================================
// Integration
// =========================================================================

export type TIntegrationId = TId<'integration'>;

export type TIntegration = TShopifyIntegration;

export interface TBaseIntegration {
	id: TIntegrationId;
	type: string;
}

export interface TShopifyIntegration extends TBaseIntegration {
	type: 'shopify';
	shopId: string;
	storefrontAccessToken: string;
}

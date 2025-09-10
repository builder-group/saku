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

export type TTextAlign = 'start' | 'center' | 'end';
export type TLineHeight =
	| { type: 'percent'; value: number }
	| { type: 'pixel'; value: number }
	| { type: 'auto' };
export type TLetterSpacing =
	| { type: 'percent'; value: number }
	| { type: 'pixel'; value: number }
	| { type: 'auto' };

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
	hash?: TAssetHash;
	altText?: string;
}

// =========================================================================
// Rich Content
// =========================================================================

export type TRichContent = TTextRichContent | TMarkdownRichContent | THtmlRichContent;

export interface TTextRichContent {
	type: 'text';
	value: string;
}

export interface TMarkdownRichContent {
	type: 'markdown';
	value: string;
}

export interface THtmlRichContent {
	type: 'html';
	value: string;
}

// =========================================================================
// Action
// =========================================================================

export type TAction = TLinkAction | TEmailAction | TPhoneAction | TSocialAction;

export interface TLinkAction {
	type: 'link';
	url: string;
	target?: '_blank' | '_self';
}

export interface TEmailAction {
	type: 'email';
	email: string;
	subject?: string;
	body?: string;
	url?: string;
}

export interface TPhoneAction {
	type: 'phone';
	phone: string;
	url?: string;
}

export interface TSocialAction {
	type: 'social';
	provider:
		| 'instagram'
		| 'x'
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
		| 'pinterest'
		| 'patreon';
	handle: string;
	url?: string;
}

//   export interface TFormAction {
// 	type: 'form';
// 	formId: string;
//   }

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

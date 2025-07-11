import { TRgba } from './color';

export interface TSite {
	version: `v0.0.1`;
	root: TPageNode;
	assets: TAsset[];
}

// =========================================================================
// Node
// =========================================================================

export type TNodeId = string;
export type TNode =
	| TPageNode
	| TAboutNode
	| TLinkNode
	| TMediaNode
	| TTextNode
	| TProductNode
	| TAssetNode
	| TPromisedNode<TLinkNode | TAssetNode>;
export type TNodeType = TNode['type'];

export interface TBaseNode {
	id: TNodeId;
	type: string;
	visible?: boolean;
}

export interface TPageNode extends TBaseNode {
	type: 'page';
	children: TNode[];
	style: {
		// Page container styles
		backgroundColor?: TRgba;
		// Child defaults (inherited by children)
		children?: {
			backgroundColor?: TRgba;
			spacing?: number;
			padding?: number;
			font?: TFont;
			fontSize?: number;
			textColor?: TRgba;
			textAlign?: 'left' | 'center' | 'right';
			borderRadius?: number;
			shadow?: boolean;
		};
	};
}

export interface TAboutNode extends TBaseNode {
	type: 'about';
	name: string;
	bio?: string;
	profilePicture?: TAssetHash;
	socialLinks?: TSocialLink[];
	style: {
		// Layout
		padding?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<TRgba>;
		// Typography
		font?: TStyleReference<TFont>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<TRgba>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TLinkNode extends TBaseNode {
	type: 'link';
	url: string;
	meta: TLinkMeta; // Current display values
	fetchedMeta?: TLinkMeta; // Original fetched values (for reset)
	style: {
		// Layout
		padding?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<TRgba>;
		// Typography
		font?: TStyleReference<TFont>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<TRgba>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TMediaNode extends TBaseNode {
	type: 'media';
	media: TMedia;
	style: {
		// Layout
		padding?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<TRgba>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TTextNode extends TBaseNode {
	type: 'text';
	title?: string;
	text: string;
	style: {
		// Layout
		padding?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<TRgba>;
		// Typography
		font?: TStyleReference<TFont>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<TRgba>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TProductNode extends TBaseNode {
	type: 'product';
	productId: string;
	variantIds: string[];
	style: {
		// Layout
		padding?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<TRgba>;
	};
}

export interface TAssetNode extends TBaseNode {
	type: 'asset';
	symbol: 'BTC';
	exchange?: 'Binance';
	price: number;
	currency: 'USDT';
}

export interface TPromisedNode<GNode extends TBaseNode> extends TBaseNode {
	type: 'promised';
	cached: GNode;
	next: Promise<GNode>;
}

// =========================================================================
// Asset
// =========================================================================

export type TAssetHash = string; // SHA-256 hash as hex string

export interface TBaseAsset {
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
}

export type TAsset = TFontAsset | TImageAsset;

// =========================================================================
// Utils
// =========================================================================

export interface TFont {
	family: string;
	weight?: number;
	style?: 'normal' | 'italic';
}

export interface TImageMedia {
	type: 'image';
	hash: TAssetHash;
	altText?: string;
}

export type TMedia = TImageMedia;

export interface TLinkMeta {
	title?: string;
	description?: string;
	favicon?: TAssetHash;
}

export type TStyleReference<T> = { type: 'inherit' } | T;

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

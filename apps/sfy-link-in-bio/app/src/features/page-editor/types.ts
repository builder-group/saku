export interface TSite {
	version: `v0.0.1`;
	id: string;
	root: TPageNode;
	assets: TAsset[];
}

export interface TResolvedSite extends Omit<TSite, 'root'> {
	root: TResolvedPageNode;
}

// =========================================================================
// Node
// =========================================================================

export type TNodeId = string;
export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode;
export type TNodeType = TNode['type'];

export type TResolvedNode =
	| TResolvedPageNode
	| TResolvedAboutNode
	| TResolvedLinkNode
	| TResolvedMediaNode
	| TResolvedTextNode;

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
		backgroundColor?: string;
		// Child defaults (inherited by children)
		children?: {
			backgroundColor?: string;
			spacing?: number;
			padding?: number;
			margin?: number;
			font?: TFont;
			fontSize?: number;
			textColor?: string;
			textAlign?: 'left' | 'center' | 'right';
			borderRadius?: number;
			shadow?: boolean;
		};
	};
}

export interface TResolvedPageNode extends Omit<TPageNode, 'style' | 'children'> {
	style: TResolveStyle<TPageNode['style']>;
	children: TResolvedNode[];
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
		margin?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<string>;
		// Typography
		font?: TStyleReference<TFont>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<string>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TResolvedAboutNode extends Omit<TAboutNode, 'style' | 'profilePicture'> {
	profilePicture?: string; // Resolved URL or base64
	style: TResolveStyle<TAboutNode['style']>;
}

export interface TLinkNode extends TBaseNode {
	type: 'link';
	url: string;
	meta: TLinkMeta; // Current display values
	fetchedMeta?: TLinkMeta; // Original fetched values (for reset)
	style: {
		// Layout
		padding?: TStyleReference<number>;
		margin?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<string>;
		// Typography
		font?: TStyleReference<TFont>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<string>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TResolvedLinkNode extends Omit<TLinkNode, 'style' | 'meta'> {
	meta: TResolvedLinkMeta;
	fetchedMeta?: TResolvedLinkMeta;
	style: TResolveStyle<TLinkNode['style']>;
}

export interface TMediaNode extends TBaseNode {
	type: 'media';
	media: TMedia;
	style: {
		// Layout
		padding?: TStyleReference<number>;
		margin?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<string>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TResolvedMediaNode extends Omit<TMediaNode, 'style' | 'media'> {
	media: TResolvedMedia;
	style: TResolveStyle<TMediaNode['style']>;
}

export interface TTextNode extends TBaseNode {
	type: 'text';
	title?: string;
	text: string;
	style: {
		// Layout
		padding?: TStyleReference<number>;
		margin?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<string>;
		// Typography
		font?: TStyleReference<TFont>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<string>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}

export interface TResolvedTextNode extends Omit<TTextNode, 'style'> {
	style: TResolveStyle<TTextNode['style']>;
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

export interface TResolvedImageMedia {
	type: 'image';
	url: string; // Resolved URL or base64
	altText?: string;
}

export type TResolvedMedia = TResolvedImageMedia;

export interface TLinkMeta {
	title?: string;
	description?: string;
	favicon?: TAssetHash;
}

export interface TResolvedLinkMeta {
	title?: string;
	description?: string;
	favicon?: string; // Resolved URL or base64
}

export type TStyleReference<T> = 'inherit' | T;

export type TResolveStyle<T> = {
	[K in keyof T]: T[K] extends TStyleReference<infer U> ? U : T[K];
};

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
		| 'spotify';
	handle: string;
	url?: string;
}

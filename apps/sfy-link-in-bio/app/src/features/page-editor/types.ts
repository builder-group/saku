export interface TSite {
	version: `v0.0.1`;
	id: string;
	root: TPageNode;
	assets: TAsset[];
}

// =========================================================================
// Node
// =========================================================================

export type TNodeId = string;
export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode;
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
		backgroundColor?: string;
		// Child defaults (inherited by children)
		children?: {
			backgroundColor?: string; // Default background for child cards
			spacing?: number; // Gap between child items
			padding?: number; // Default padding for child items
			margin?: number; // Default margin for child items
			fontFamily?: string; // Default font family for children
			fontSize?: number; // Default font size for children
			textColor?: string; // Default text color for children
			textAlign?: 'left' | 'center' | 'right'; // Default text alignment for children
			borderRadius?: number; // Default border radius for children
			shadow?: boolean; // Default shadow for children
		};
	};
}

export interface TAboutNode extends TBaseNode {
	type: 'about';
	name: string;
	bio?: string;
	media: TMedia;
	socialLinks?: TSocialLink[];
	style: {
		// Layout
		padding?: TStyleReference<number>;
		margin?: TStyleReference<number>;
		// Background
		backgroundColor?: TStyleReference<string>;
		// Typography
		fontFamily?: TStyleReference<string>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<string>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}
export interface TResolvedAboutNode extends Omit<TAboutNode, 'style'> {
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
		fontFamily?: TStyleReference<string>;
		fontSize?: TStyleReference<number>;
		textColor?: TStyleReference<string>;
		textAlign?: TStyleReference<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleReference<number>;
		shadow?: TStyleReference<boolean>;
	};
}
export interface TResolvedLinkNode extends Omit<TLinkNode, 'style'> {
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
export interface TResolvedMediaNode extends Omit<TMediaNode, 'style'> {
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
		fontFamily?: TStyleReference<string>;
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

export type TAssetId = string;

export interface TBaseAsset {
	id: TAssetId;
	type: string;
	contentType: string; // MIME type
	content: { type: 'url'; url: string } | { type: 'binary'; data: string }; // base64 for binary
	fileName?: string;
}

export interface TFontAsset extends TBaseAsset {
	type: 'font';
	contentType: 'font/woff' | 'font/woff2' | 'font/ttf' | 'font/otf';
}

export interface TImageAsset extends TBaseAsset {
	type: 'image';
	contentType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' | 'image/svg+xml';
}

export type TAsset = TFontAsset | TImageAsset;

// =========================================================================
// Utils (simplified)
// =========================================================================

export interface TImageMedia {
	type: 'image';
	url: string;
	altText?: string;
}

export interface TLinkMeta {
	title?: string;
	description?: string;
	faviconUrl?: string;
}

export type TStyleReference<T> = 'inherit' | T;

export type TResolveStyle<T> = {
	[K in keyof T]: T[K] extends TStyleReference<infer U> ? U : T[K];
};

export type TMedia = TImageMedia;

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

export interface TResolvedPageNode extends Omit<TPageNode, 'style' | 'children'> {
	style: TResolveStyle<TPageNode['style']>;
	children: TResolvedNode[];
}

// Generic resolved node type
export type TResolvedNode =
	| TResolvedPageNode
	| TResolvedAboutNode
	| TResolvedLinkNode
	| TResolvedMediaNode
	| TResolvedTextNode;

export interface TResolvedSite extends Omit<TSite, 'root'> {
	root: TResolvedPageNode;
}

// Helper type for components that need resolved styles
export type TWithResolvedStyles<T extends TNode> = T extends TPageNode
	? TResolvedPageNode
	: T extends TAboutNode
		? TResolvedAboutNode
		: T extends TLinkNode
			? TResolvedLinkNode
			: T extends TMediaNode
				? TResolvedMediaNode
				: T extends TTextNode
					? TResolvedTextNode
					: never;

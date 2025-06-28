// =========================================================================
// Node
// =========================================================================

export type TNodeId = string;
export type TNode = TSiteNode | TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode;
export type TNodeType = TNode['type'];

export type TStyleProperty<T> = 'inherit' | T;

export interface TBaseNode {
	id: TNodeId;
	type: string;
	visible?: boolean;
}

export interface TSiteNode extends TBaseNode {
	type: 'site';
	version: `v0.0.1`;
	children: TNode[];
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
		padding?: TStyleProperty<number>;
		margin?: TStyleProperty<number>;
		// Background
		backgroundColor?: TStyleProperty<string>;
		// Typography
		fontFamily?: TStyleProperty<string>;
		fontSize?: TStyleProperty<number>;
		textColor?: TStyleProperty<string>;
		textAlign?: TStyleProperty<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleProperty<number>;
		shadow?: TStyleProperty<boolean>;
	};
}

export interface TLinkNode extends TBaseNode {
	type: 'link';
	url: string;
	meta: TLinkMeta; // Current display values
	fetchedMeta?: TLinkMeta; // Original fetched values (for reset)
	style: {
		// Layout
		padding?: TStyleProperty<number>;
		margin?: TStyleProperty<number>;
		// Background
		backgroundColor?: TStyleProperty<string>;
		// Typography
		fontFamily?: TStyleProperty<string>;
		fontSize?: TStyleProperty<number>;
		textColor?: TStyleProperty<string>;
		textAlign?: TStyleProperty<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleProperty<number>;
		shadow?: TStyleProperty<boolean>;
	};
}

export interface TMediaNode extends TBaseNode {
	type: 'media';
	media: TMedia;
	style: {
		// Layout
		padding?: TStyleProperty<number>;
		margin?: TStyleProperty<number>;
		// Background
		backgroundColor?: TStyleProperty<string>;
		// Border and effects
		borderRadius?: TStyleProperty<number>;
		shadow?: TStyleProperty<boolean>;
	};
}

export interface TTextNode extends TBaseNode {
	type: 'text';
	title?: string;
	text: string;
	style: {
		// Layout
		padding?: TStyleProperty<number>;
		margin?: TStyleProperty<number>;
		// Background
		backgroundColor?: TStyleProperty<string>;
		// Typography
		fontFamily?: TStyleProperty<string>;
		fontSize?: TStyleProperty<number>;
		textColor?: TStyleProperty<string>;
		textAlign?: TStyleProperty<'left' | 'center' | 'right'>;
		// Border and effects
		borderRadius?: TStyleProperty<number>;
		shadow?: TStyleProperty<boolean>;
	};
}

// =========================================================================
// Utils
// =========================================================================

export type TMedia = TImageMedia;

export interface TImageMedia {
	type: 'image';
	url: string;
	mimeType?: string;
	fileName?: string;
	altText?: string;
	previewImageUrl?: string;
}

export interface TLinkMeta {
	title?: string;
	description?: string;
	// imageUrl?: string;
	faviconUrl?: string;
}

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

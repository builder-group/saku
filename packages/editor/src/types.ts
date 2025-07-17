import { TRgba } from './lib/color';
import { TId } from './lib/id';

export interface TSite {
	version: `v0.0.1`;
	root: TNode;
	assets: TAsset[];
}

export interface TFlatSite {
	version: TSite['version'];
	rootId: TNodeId;
	nodes: Record<TNodeId, TFlatNode>;
	assets: Record<TAssetHash, TAsset>;
}

// =========================================================================
// Node
// =========================================================================

export type TNodeId = TId<'node'>;

export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode | TProductNode;
export type TFlatNode =
	| TFlatPageNode
	| TAboutNode
	| TLinkNode
	| TMediaNode
	| TTextNode
	| TProductNode;

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
		backgroundColor: TRgba;
		// Child defaults (inherited by children)
		children: {
			backgroundColor: TRgba;
			spacing: number;
			padding: number;
			font: TFont;
			fontSize: number;
			textColor: TRgba;
			textAlign: 'left' | 'center' | 'right';
			borderRadius: number;
			shadow: boolean;
		};
	};
}

export interface TFlatPageNode extends Omit<TPageNode, 'children'> {
	children: TNodeId[];
}

export interface TAboutNode extends TBaseNode {
	type: 'about';
	content: {
		name: string;
		bio?: string;
		profilePicture?: TAssetHash;
		socialLinks: TSocialLink[];
	};
	style: TLayoutMixin & TBackgroundMixin & TBorderMixin & TTypographyMixin;
}

export interface TLinkNode extends TBaseNode {
	type: 'link';
	content: {
		url: string;
		userMetadata: TLinkMetadata;
		fetchedMetadata?: TLinkMetadata;
	};
	style: TLayoutMixin & TBackgroundMixin & TBorderMixin & TTypographyMixin;
}

export interface TMediaNode extends TBaseNode {
	type: 'media';
	content: {
		media?: TMedia;
	};
	style: TLayoutMixin & TBackgroundMixin & TBorderMixin;
}

export interface TTextNode extends TBaseNode {
	type: 'text';
	content: {
		title?: string;
		text: string;
	};
	style: TLayoutMixin & TBackgroundMixin & TBorderMixin & TTypographyMixin;
}

export interface TProductNode extends TBaseNode {
	type: 'product';
	content: {
		product?: {
			id: string;
			title: string;
			images: TAssetHash[];
			options: { name: string; values: string[] }[];
			variants: {
				id: string;
				title: string;
				price: { amount: string; currencyCode: string };
				image?: TAssetHash;
				selectedOptions: { name: string; value: string }[];
			}[];
			checkoutUrl: string;
		};
	};
	style: TLayoutMixin & TBackgroundMixin & TBorderMixin & Omit<TTypographyMixin, 'textAlign'>;
}

// =========================================================================
// Asset
// =========================================================================

export type TAssetId = TId<'asset'>;
export type TAssetHash = string; // SHA-256 hash as hex string

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

export type TAsset = TFontAsset | TImageAsset;

// =========================================================================
// Mixins
// =========================================================================

export interface TLayoutMixin {
	padding: TStyleReference<number>;
}

export interface TBackgroundMixin {
	backgroundColor: TStyleReference<TRgba>;
}

export interface TTypographyMixin {
	font: TStyleReference<TFont>;
	fontSize: TStyleReference<number>;
	textColor: TStyleReference<TRgba>;
	textAlign: TStyleReference<'left' | 'center' | 'right'>;
}

export interface TBorderMixin {
	borderRadius: TStyleReference<number>;
	shadow: TStyleReference<boolean>;
}

// export interface TSpacingMixin {
// 	spacing: TStyleReference<number>;
// }

// =========================================================================
// Utils
// =========================================================================

export interface TFont {
	family: string;
	weight?: number;
	style?: 'normal' | 'italic';
}

export type TMedia = TImageMedia; // | TYouTubeMedia;

export interface TImageMedia {
	type: 'image';
	hash: TAssetHash;
	altText?: string;
}

export interface TYouTubeMedia {
	type: 'youtube';
	url: string;
	videoId: string;
	thumbnail?: TAssetHash;
}

export interface TLinkMetadata {
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

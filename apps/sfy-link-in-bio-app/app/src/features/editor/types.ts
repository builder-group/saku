// ============================================================================
// Node
// ============================================================================

export interface TBaseNode {
	id: TBlockId;
	type: string;
}

export interface TSiteNode extends TBaseNode {
	type: 'site';
	version: `v0.0.1`;
	children: TNode[];
}

interface TPageNode extends TBaseNode {
	type: 'page';
	blocks: TBlock[]; // TODO: Make blocks children in the future
	// children: TNode[];
}

export type TNodeId = string;
export type TNode = TSiteNode | TPageNode;
export type TNodeType = TNode['type'];

export type TVersion = `v${number}.${number}.${number}`;

// ============================================================================
// Block
// ============================================================================

export type TBlockId = string;
export type TBlock = TAboutBlock | TLinkBlock | TMediaBlock | TTextBlock;
export type TBlockType = TBlock['type'];

export interface TBaseBlock {
	id: TBlockId;
	type: string;
	styles: Record<string, string>;
}

export interface TAboutBlock extends TBaseBlock {
	type: 'about';
	name: string;
	bio?: string;
	avatarUrl?: string;
}

export interface TLinkBlock extends TBaseBlock {
	type: 'link';
	url: string;
	meta?: TLinkMeta;
	customMeta?: TLinkMeta;
}

export interface TLinkMeta {
	title?: string;
	faviconUrl?: string;
	imageUrl?: string;
}

export interface TMediaBlock extends TBaseBlock {
	type: 'media';
	media: TMedia;
}

export type TMedia = TImageMedia;

export interface TImageMedia {
	type: 'image';
	url: string;
	mimeType?: string;
	fileName?: string;
	altText?: string;
	previewImageUrl?: string;
}

export interface TTextBlock extends TBaseBlock {
	type: 'text';
	title?: string;
	text: string;
	alignment: 'left' | 'center' | 'right';
}

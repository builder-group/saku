export type TNodeId = string;
export type TNode = TSiteNode | TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode;
export type TNodeType = TNode['type'];

export interface TBaseNode {
	id: TNodeId;
	type: string;
}

export interface TSiteNode extends TBaseNode {
	type: 'site';
	version: `v0.0.1`;
	children: TNode[];
}

export interface TPageNode extends TBaseNode {
	type: 'page';
	children: TNode[];
}

export interface TAboutNode extends TBaseNode {
	type: 'about';
	name: string;
	bio?: string;
	avatarUrl?: string;
}

export interface TLinkNode extends TBaseNode {
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

export interface TMediaNode extends TBaseNode {
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

export interface TTextNode extends TBaseNode {
	type: 'text';
	title?: string;
	text: string;
	alignment: 'left' | 'center' | 'right';
}

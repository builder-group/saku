import {
	TAboutNode,
	TLinkNode,
	TMediaNode,
	TPageNode,
	TProductNode,
	TRgba,
	TSite,
	TStyleReference,
	TTextNode
} from '@repo/editor';

export interface TResolvedSite extends Omit<TSite, 'root'> {
	root: TResolvedPageNode;
}

export type TResolvedNode =
	| TResolvedPageNode
	| TResolvedAboutNode
	| TResolvedLinkNode
	| TResolvedMediaNode
	| TResolvedTextNode
	| TResolvedProductNode;

export interface TResolvedPageNode extends Omit<TPageNode, 'style' | 'children'> {
	style: {
		backgroundColor: TResolveStyle<TPageNode['style']>['backgroundColor'];
		watermarkColor: string;
		children?: TResolveStyle<NonNullable<TPageNode['style']['children']>>;
	};
	children: TResolvedNode[];
}

export interface TResolvedAboutNode extends Omit<TAboutNode, 'style' | 'profilePicture'> {
	profilePicture?: string; // Resolved URL or base64
	style: TResolveStyle<TAboutNode['style']>;
}

export interface TResolvedLinkNode extends Omit<TLinkNode, 'style' | 'meta' | 'fetchedMeta'> {
	meta: TResolvedLinkMeta;
	fetchedMeta?: TResolvedLinkMeta;
	style: TResolveStyle<TLinkNode['style']>;
}

export interface TResolvedMediaNode extends Omit<TMediaNode, 'style' | 'media'> {
	media: TResolvedMedia;
	style: TResolveStyle<TMediaNode['style']>;
}

export interface TResolvedTextNode extends Omit<TTextNode, 'style'> {
	style: TResolveStyle<TTextNode['style']>;
}

export interface TResolvedProductNode extends Omit<TProductNode, 'style'> {
	style: TResolveStyle<TProductNode['style']>;
}

export interface TResolvedImageMedia {
	type: 'image';
	url: string; // Resolved URL or base64
	altText?: string;
}

export type TResolvedMedia = TResolvedImageMedia;

export interface TResolvedLinkMeta {
	title?: string;
	description?: string;
	favicon?: string; // Resolved URL or base64
}

type TResolveColor<T> = T extends TRgba ? string : T;

type TResolveStyle<T> = {
	[K in keyof T]: T[K] extends TStyleReference<infer U> ? TResolveColor<U> : T[K];
};

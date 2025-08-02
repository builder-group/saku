import {
	TAboutNode,
	TBaseNode,
	TLinkNode,
	TMediaNode,
	TPageNode,
	TProductNode,
	TRgba,
	TSite,
	TStyleReference,
	TTextNode
} from '@repo/editor';

export interface TResolvedSite extends Omit<TSite, 'root' | 'assets' | 'integrations'> {
	root: TResolvedPageNode;
}

export type TResolvedNode =
	| TResolvedPageNode
	| TResolvedAboutNode
	| TResolvedLinkNode
	| TResolvedMediaNode
	| TResolvedTextNode
	| TResolvedProductNode
	| TResolvedPromisedNode<TResolvedNode>;

export interface TResolvedPageNode extends Omit<TPageNode, 'style' | 'content' | 'children'> {
	content: {
		metadata: {
			title: string;
			description: string;
			image?: string;
		};
	};
	children: TResolvedNode[];
	style: {
		backgroundColor: TResolveStyle<TPageNode['style']>['backgroundColor'];
		watermarkColor: string;
		children: TResolveStyle<NonNullable<TPageNode['style']['children']>>;
	};
}

export interface TResolvedAboutNode extends Omit<TAboutNode, 'style' | 'content'> {
	content: {
		name: TAboutNode['content']['name'];
		bio?: TAboutNode['content']['bio'];
		profilePicture?: string; // Resolved URL or base64
		socialLinks: TAboutNode['content']['socialLinks'];
	};
	style: TResolveStyle<TAboutNode['style']>;
}

export interface TResolvedLinkNode extends Omit<TLinkNode, 'style' | 'content'> {
	content: {
		url: TLinkNode['content']['url'];
		variant: TResolvedLinkVariant;
	};
	style: TResolveStyle<TLinkNode['style']>;
}

export interface TResolvedMediaNode extends Omit<TMediaNode, 'style' | 'content'> {
	content: {
		media?: TResolvedMedia;
	};
	style: TResolveStyle<TMediaNode['style']>;
}

export interface TResolvedTextNode extends Omit<TTextNode, 'style'> {
	style: TResolveStyle<TTextNode['style']>;
}

export interface TResolvedProductNode extends Omit<TProductNode, 'style' | 'content'> {
	content: {
		product?: {
			id: string;
			title: string;
			images: string[]; // Resolved URL or base64
			options: { name: string; values: string[] }[];
			variants: {
				id: string;
				title: string;
				price: { amount: string; currencyCode: string };
				image?: string; // Resolved URL or base64
				selectedOptions: { name: string; value: string }[];
			}[];
		};
	};
	style: TResolveStyle<TProductNode['style']>;
}

export interface TResolvedPromisedNode<GNode extends TResolvedNode> extends TBaseNode {
	type: 'promised';
	cached: GNode;
	next: Promise<GNode>;
}

export interface TResolvedImageMedia {
	type: 'image';
	url: string; // Resolved URL or base64
	altText?: string;
}

export type TResolvedMedia = TResolvedImageMedia;

export type TResolvedLinkVariant = TResolvedDefaultLinkVariant | TResolvedYouTubeLinkVariant;

export interface TResolvedDefaultLinkVariant {
	type: 'default';
	title?: string;
	description?: string;
	favicon?: string;
}

export interface TResolvedYouTubeLinkVariant {
	type: 'youtube';
	title?: string;
	// TODO
}

export type TResolveStyle<T> = {
	[K in keyof T]?: T[K] extends TStyleReference<infer U> ? (U extends TRgba ? string : U) : T[K];
};

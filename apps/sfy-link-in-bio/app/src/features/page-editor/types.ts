import {
	TAboutNode,
	TAsset,
	TAssetHash,
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

export interface TResolvedSite extends Omit<TSite, 'root'> {
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

export interface TResolvedPageNode extends Omit<TPageNode, 'style' | 'children'> {
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
		meta: TResolvedLinkMeta;
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
			variant?: {
				id: string;
				title: string;
				price: { amount: string; currencyCode: string };
				image?: string; // Resolved URL or base64
				selectedOptions: { name: string; value: string }[];
			};
			checkoutUrl: string;
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

export interface TResolvedLinkMeta {
	title?: string;
	description?: string;
	favicon?: string; // Resolved URL or base64
}

export type TResolveStyle<T> = {
	[K in keyof T]?: T[K] extends TStyleReference<infer U> ? (U extends TRgba ? string : U) : T[K];
};

export interface TNodeResolutionContext {
	assetsMap: Record<TAssetHash, TAsset>;
	defaultStyles?: TPageNode['style']['children'];
	shopId: string;
}

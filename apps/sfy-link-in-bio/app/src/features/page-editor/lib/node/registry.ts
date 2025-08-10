import {
	AboutNode,
	AboutNodeEditor,
	aboutNodeMetadata,
	getAboutNodeAssetHashes,
	getLinkNodeAssetHashes,
	getMediaNodeAssetHashes,
	getPageNodeAssetHashes,
	getProductNodeAssetHashes,
	getTextNodeAssetHashes,
	LinkNode,
	LinkNodeEditor,
	linkNodeMetadata,
	MediaNode,
	MediaNodeEditor,
	mediaNodeMetadata,
	PageNode,
	PageNodeEditor,
	pageNodeMetadata,
	ProductNode,
	ProductNodeEditor,
	productNodeMetadata,
	ResolvedAboutNode,
	ResolvedLinkNode,
	ResolvedMediaNode,
	ResolvedPageNode,
	ResolvedProductNode,
	ResolvedPromisedNode,
	ResolvedTextNode,
	TextNode,
	TextNodeEditor,
	textNodeMetadata
} from '../../nodes';

export const nodeMetadataRegistry = {
	page: pageNodeMetadata,
	about: aboutNodeMetadata,
	link: linkNodeMetadata,
	media: mediaNodeMetadata,
	text: textNodeMetadata,
	product: productNodeMetadata
} as const;

export const nodeMetadata = Object.values(nodeMetadataRegistry);

export const nodeAssetHashRegistry = {
	page: getPageNodeAssetHashes,
	about: getAboutNodeAssetHashes,
	link: getLinkNodeAssetHashes,
	media: getMediaNodeAssetHashes,
	text: getTextNodeAssetHashes,
	product: getProductNodeAssetHashes
} as const;

export const nodeRegistry = {
	page: PageNode,
	about: AboutNode,
	link: LinkNode,
	media: MediaNode,
	text: TextNode,
	product: ProductNode
} as const;

export const resolvedNodeRegistry = {
	page: ResolvedPageNode,
	about: ResolvedAboutNode,
	link: ResolvedLinkNode,
	media: ResolvedMediaNode,
	text: ResolvedTextNode,
	product: ResolvedProductNode,
	promised: ResolvedPromisedNode
} as const;

export const nodeEditorRegistry = {
	site: null,
	page: PageNodeEditor,
	about: AboutNodeEditor,
	link: LinkNodeEditor,
	media: MediaNodeEditor,
	text: TextNodeEditor,
	product: ProductNodeEditor,
	promised: null
} as const;

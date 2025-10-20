import {
	AboutNode,
	AboutNodeContentEditor,
	aboutNodeMetadata,
	AboutNodeStyleEditor,
	getAboutNodeAssetHashes,
	getLinkNodeAssetHashes,
	getMediaNodeAssetHashes,
	getPageNodeAssetHashes,
	getProductNodeAssetHashes,
	getTextNodeAssetHashes,
	LinkNode,
	LinkNodeContentEditor,
	linkNodeMetadata,
	LinkNodeStyleEditor,
	MediaNode,
	MediaNodeContentEditor,
	mediaNodeMetadata,
	MediaNodeStyleEditor,
	PageNode,
	PageNodeContentEditor,
	pageNodeMetadata,
	PageNodeStyleEditor,
	ProductNode,
	ProductNodeContentEditor,
	productNodeMetadata,
	ProductNodeStyleEditor,
	ResolvedAboutNode,
	ResolvedLinkNode,
	ResolvedMediaNode,
	ResolvedPageNode,
	ResolvedProductNode,
	ResolvedPromisedNode,
	ResolvedTextNode,
	TextNode,
	TextNodeContentEditor,
	textNodeMetadata,
	TextNodeStyleEditor
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

export const nodeContentEditorRegistry = {
	site: null,
	page: PageNodeContentEditor,
	about: AboutNodeContentEditor,
	link: LinkNodeContentEditor,
	media: MediaNodeContentEditor,
	text: TextNodeContentEditor,
	product: ProductNodeContentEditor,
	promised: null
} as const;

export const nodeStyleEditorRegistry = {
	site: null,
	page: PageNodeStyleEditor,
	about: AboutNodeStyleEditor,
	link: LinkNodeStyleEditor,
	media: MediaNodeStyleEditor,
	text: TextNodeStyleEditor,
	product: ProductNodeStyleEditor,
	promised: null
} as const;

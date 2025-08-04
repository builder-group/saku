import {
	AboutNode,
	AboutNodeEditor,
	aboutNodeMetadata,
	getAboutNodeAssetHashes,
	ResolvedAboutNode
} from './nodes/about-node';
import {
	getLinkNodeAssetHashes,
	LinkNode,
	LinkNodeEditor,
	linkNodeMetadata,
	ResolvedLinkNode
} from './nodes/link-node';
import {
	getMediaNodeAssetHashes,
	MediaNode,
	MediaNodeEditor,
	mediaNodeMetadata,
	ResolvedMediaNode
} from './nodes/media-node';
import {
	getPageNodeAssetHashes,
	PageNode,
	PageNodeEditor,
	ResolvedPageNode
} from './nodes/page-node';
import { pageNodeMetadata } from './nodes/page-node/metadata';
import {
	getProductNodeAssetHashes,
	ProductNode,
	ProductNodeEditor,
	productNodeMetadata,
	ResolvedProductNode
} from './nodes/product-node';
import { ResolvedPromisedNode } from './nodes/promised-node';
import {
	getTextNodeAssetHashes,
	ResolvedTextNode,
	TextNode,
	TextNodeEditor
} from './nodes/text-node';
import { textNodeMetadata } from './nodes/text-node/metadata';

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

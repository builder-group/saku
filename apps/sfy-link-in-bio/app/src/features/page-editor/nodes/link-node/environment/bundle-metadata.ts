import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TEmbedStyleMixin,
	TFillStyleMixin,
	TIdMixin,
	TImageStyleMixin,
	TLinkNode,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextBodyStyleMixin,
	TTextCaptionStyleMixin
} from '@repo/editor';
import { type TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import {
	classicBundleMetadata,
	featuredBundleMetadata,
	spotifyEmbedBundleMetadata,
	youtubeEmbedBundleMetadata
} from '../bundles';

export const linkNodeBundleMetadataMap = {
	'classic': classicBundleMetadata,
	'featured': featuredBundleMetadata,
	'youtube-embed': youtubeEmbedBundleMetadata,
	'spotify-embed': spotifyEmbedBundleMetadata
};

export const linkNodeBundleMetadata = Object.values(linkNodeBundleMetadataMap);

export const linkNodeBundlePriority: TLinkNode['bundleType'][] = [
	'youtube-embed',
	'spotify-embed',
	'classic',
	'featured'
];

export interface TLinkNodeBundleMetadata<GNode extends TLinkNode = TLinkNode> {
	type: GNode['bundleType'];
	label: string;
	isApplicable: (url: string) => boolean;
	/**
	 * Creates a new node bundle, replacing the entire node with the new bundle
	 */
	switch: (cx: {
		node: TNodeState<GNode>;
		common: TCommonFields;
		editor: TPageEditor;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Optional method to enhance the node bundle with additional data after creation or url change
	 */
	enhance?: (cx: {
		node: TNodeState<GNode>;
		editor: TPageEditor;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Extracts common fields from a node bundle
	 */
	extractCommonFields: (node: GNode) => TCommonFields;
}

interface TCommonFields {
	id: TIdMixin['value'];
	content?: {
		title?: string;
		userTitle?: string;
		description?: string;
		userDescription?: string;
		thumbnail?: string;
		userThumbnail?: string | null;
	};
	autoLayout?: TAutoLayoutStyleMixin['value'];
	appearance?: TAppearanceStyleMixin['value'];
	fill?: TFillStyleMixin['value'];
	stroke?: TStrokeStyleMixin['value'];
	shadow?: TShadowStyleMixin['value'];
	textBody?: TTextBodyStyleMixin['value'];
	textCaption?: TTextCaptionStyleMixin['value'];
	image?: TImageStyleMixin['value'];
	embed?: TEmbedStyleMixin['value'];
}

import {
	TLinkNode,
	TLinkNodeContent,
	TSingleLinkNodeContent,
	TYouTubeVideoEmbedLinkNodeContent
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { Err, Ok, type TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { extractYouTubeVideoId, fetchUrlMetadata } from '../lib';

export const contentMetadataMap = {
	'single': {
		type: 'single',
		label: 'Single',
		isApplicable: () => true,
		extractCommonFields(variant) {
			return {
				title: variant.title,
				userTitle: variant.userTitle
			};
		},
		async createContent(cx) {
			cx.nodeState._v.content = {
				type: 'single',
				url: cx.url,
				title: cx.common.title,
				userTitle: cx.common.userTitle,
				description: cx.common.description
			};
			cx.nodeState._notify();
			return Ok(undefined);
		},
		async enhanceContent(cx) {
			const metadata = await fetchUrlMetadata(cx.url, cx.shopify);
			if (metadata == null) {
				return Err(
					new AppError('#ERR_FAILED_TO_FETCH_URL_METADATA', {
						detail: 'Failed to fetch URL metadata'
					})
				);
			}

			let faviconHash: string | null = null;
			if (metadata.favicon != null) {
				faviconHash = cx.editor.registerImage(metadata.favicon, 'favicon');
			}

			const content = cx.nodeState._v.content;

			// Update all fields with new metadata (overwriting existing)
			content.title = metadata.title;
			content.description = metadata.description;
			if (faviconHash != null) content.favicon = faviconHash;

			cx.nodeState._notify();
			return Ok(undefined);
		}
	} satisfies TContentMetadata<TSingleLinkNodeContent>,
	'youtube-video-embed': {
		type: 'youtube-video-embed',
		label: 'YouTube Video Embed',
		isApplicable(url) {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i.test(url) ||
				/^https?:\/\/youtu\.be\//i.test(url)
			);
		},
		extractCommonFields() {
			return {};
		},
		async createContent(cx) {
			const videoId = extractYouTubeVideoId(cx.url) ?? '';
			cx.nodeState._v.content = {
				type: 'youtube-video-embed',
				url: cx.url,
				videoId
			};
			cx.nodeState._notify();
			return Ok(undefined);
		},
		async enhanceContent(cx) {
			const videoId = extractYouTubeVideoId(cx.url) ?? '';
			const content = cx.nodeState._v.content;

			if (videoId !== content.videoId) {
				content.videoId = videoId;
				cx.nodeState._notify();
			}

			return Ok(undefined);
		}
	} satisfies TContentMetadata<TYouTubeVideoEmbedLinkNodeContent>
};

export const contentMetadata = Object.values(contentMetadataMap);

export type TContentType = keyof typeof contentMetadataMap;

export interface TContentMetadata<GContent extends TLinkNodeContent = TLinkNodeContent> {
	type: GContent['type'];
	label: string;
	isApplicable: (url: string) => boolean;
	/**
	 * Creates a new content, modifying the nodeState directly
	 */
	createContent: (cx: {
		url: string;
		common: TCommonContentFields;
		editor: TPageEditor;
		shopify: ShopifyGlobal;
		nodeState: TNodeState<TLinkNode<GContent>>;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Optional method to enhance the content with additional data after creation or url change
	 */
	enhanceContent?: (cx: {
		url: string;
		editor: TPageEditor;
		shopify: ShopifyGlobal;
		nodeState: TNodeState<TLinkNode<GContent>>;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Extracts common fields from a content of this type
	 */
	extractCommonFields: (content: GContent) => TCommonContentFields;
}

interface TCommonContentFields {
	title?: string;
	userTitle?: string;
	description?: string;
}

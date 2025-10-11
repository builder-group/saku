import {
	createSpotifyEmbedUrl,
	extractSpotifyId,
	extractYouTubeId,
	TLinkNode,
	tokenRef,
	TSingleLinkNodeBundle,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { Err, Ok, type TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from '../../../../../mixins';
import { fetchSpotifyTheme, fetchUrlMetadata } from '../lib';

// TODO: We update bundle without updating the mixins accordingly.. idk..

export const contentMetadataMap = {
	'single': {
		type: 'single',
		label: 'Link Card',
		isApplicable: () => true,
		extractCommonFields(variant) {
			return {
				title: variant.title,
				userTitle: variant.userTitle
			};
		},
		async createContent(cx) {
			cx.node._v.bundle = 'single';
			cx.node._v.content = {
				type: 'single',
				url: cx.url,
				title: cx.common.title,
				userTitle: cx.common.userTitle,
				description: cx.common.description
			};
			const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.node._v.autoLayout);
			unpackedAutoLayout.horizontalPadding = tokenRef(
				'auto-layout.default',
				'auto-layout',
				'horizontalPadding'
			);
			unpackedAutoLayout.verticalPadding = tokenRef(
				'auto-layout.default',
				'auto-layout',
				'verticalPadding'
			);
			cx.node._v.autoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
			cx.node._notify();
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

			const content = cx.node._v.content;

			// Update all fields with new metadata (overwriting existing)
			content.title = metadata.title;
			content.description = metadata.description;
			if (faviconHash != null) content.favicon = faviconHash;

			cx.node._notify();
			return Ok(undefined);
		}
	} satisfies TContentMetadata<TSingleLinkNodeBundle>,
	'youtube-embed': {
		type: 'youtube-embed',
		label: 'YouTube Embed',
		isApplicable(url) {
			if (!url.trim().length) {
				return false;
			}
			const youtubeData = extractYouTubeId(url);
			return youtubeData != null;
		},
		extractCommonFields() {
			return {};
		},
		async createContent(cx) {
			const youtubeData = extractYouTubeId(cx.url);
			if (youtubeData == null) {
				return Err(
					new AppError('#ERR_INVALID_YOUTUBE_URL', {
						detail: 'Invalid YouTube URL'
					})
				);
			}

			cx.node._v.bundle = 'youtube-embed';
			cx.node._v.content = {
				type: 'youtube-embed',
				url: cx.url,
				contentType: youtubeData.type,
				contentId: youtubeData.id
			};
			const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.node._v.autoLayout);
			unpackedAutoLayout.horizontalPadding = 0;
			unpackedAutoLayout.verticalPadding = 0;
			cx.node._v.autoLayout = unpackedAutoLayout;
			cx.node._notify();
			return Ok(undefined);
		},
		async enhanceContent(cx) {
			const youtubeData = extractYouTubeId(cx.url);
			if (youtubeData == null) {
				return Ok(undefined);
			}

			const content = cx.node._v.content;
			if (youtubeData.type !== content.contentType || youtubeData.id !== content.contentId) {
				content.contentType = youtubeData.type;
				content.contentId = youtubeData.id;
				cx.node._notify();
			}

			return Ok(undefined);
		}
	} satisfies TContentMetadata<TYouTubeEmbedLinkNodeBundle>,
	'spotify-embed': {
		type: 'spotify-embed',
		label: 'Spotify Embed',
		isApplicable(url) {
			if (!url.trim().length) {
				return false;
			}
			const spotifyData = extractSpotifyId(url);
			return spotifyData != null;
		},
		extractCommonFields() {
			return {};
		},
		async createContent(cx) {
			const spotifyData = extractSpotifyId(cx.url);
			if (spotifyData == null) {
				return Err(
					new AppError('#ERR_INVALID_SPOTIFY_URL', {
						detail: 'Invalid Spotify URL'
					})
				);
			}

			cx.node._v.bundle = 'spotify-embed';
			cx.node._v.content = {
				type: 'spotify-embed',
				url: cx.url,
				contentType: spotifyData.type,
				contentId: spotifyData.id,
				height: 152 // Default to compact height
			};
			const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.node._v.autoLayout);
			unpackedAutoLayout.horizontalPadding = 0;
			unpackedAutoLayout.verticalPadding = 0;
			cx.node._v.autoLayout = unpackedAutoLayout;
			cx.node._notify();
			return Ok(undefined);
		},
		async enhanceContent(cx) {
			const spotifyData = extractSpotifyId(cx.url);
			if (spotifyData == null) {
				return Ok(undefined);
			}

			const content = cx.node._v.content;
			let hasChanges = false;

			// Update content type and ID if changed
			if (spotifyData.type !== content.contentType || spotifyData.id !== content.contentId) {
				content.contentType = spotifyData.type;
				content.contentId = spotifyData.id;
				hasChanges = true;
			}

			// Fetch theme for the Spotify URL
			const theme = await fetchSpotifyTheme(
				createSpotifyEmbedUrl(content.contentType, content.contentId),
				cx.shopify
			);
			if (theme != null) {
				content.theme = theme;
				hasChanges = true;
			}

			if (hasChanges) {
				cx.node._notify();
			}

			return Ok(undefined);
		}
	} satisfies TContentMetadata<TSpotifyEmbedLinkNodeBundle>
};

export const contentMetadata = Object.values(contentMetadataMap);

// Content type priority for auto-switching (most specific to most generic)
export const contentTypePriority: TContentType[] = ['youtube-embed', 'spotify-embed', 'single'];

export type TContentType = keyof typeof contentMetadataMap;

export interface TContentMetadata<GNode extends TLinkNode> {
	type: GNode['bundle'];
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
		node: TNodeState<GNode>;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Optional method to enhance the content with additional data after creation or url change
	 */
	enhanceContent?: (cx: {
		url: string;
		editor: TPageEditor;
		shopify: ShopifyGlobal;
		node: TNodeState<GNode>;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Extracts common fields from a content of this type
	 */
	extractCommonFields: (content: GNode['content']) => TCommonContentFields;
}

interface TCommonContentFields {
	title?: string;
	userTitle?: string;
	description?: string;
}

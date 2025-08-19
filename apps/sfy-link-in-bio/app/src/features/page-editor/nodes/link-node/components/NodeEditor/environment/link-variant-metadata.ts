import {
	TDefaultLinkVariant,
	TLinkNode,
	TLinkVariant,
	TYouTubeVideoEmbedVariant
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { Err, Ok, type TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { extractYouTubeVideoId, fetchUrlMetadata } from '../lib';

export const linkVariantMetadataMap = {
	'default': {
		type: 'default',
		label: 'Default',
		isApplicable: () => true, // Always available
		extractCommonFields(variant) {
			return {
				title: variant.title,
				userTitle: variant.userTitle
			};
		},
		async createVariant(cx) {
			cx.nodeState._v.content.variant = {
				type: 'default',
				title: cx.common.title,
				userTitle: cx.common.userTitle,
				description: cx.common.description
			};
			cx.nodeState._notify();
			return Ok(undefined);
		},
		async enhanceVariant(cx) {
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

			const variant = cx.nodeState._v.content.variant as TDefaultLinkVariant;

			// Update all fields with new metadata (overwriting existing)
			variant.title = metadata.title;
			variant.description = metadata.description;
			if (faviconHash != null) variant.favicon = faviconHash;

			cx.nodeState._notify();
			return Ok(undefined);
		}
	} satisfies TLinkVariantMetadata<TDefaultLinkVariant>,
	// 'youtube-video': {
	// 	type: 'youtube-video',
	// 	label: 'YouTube Video',
	// 	isApplicable(url) {
	// 		if (!url.trim().length) {
	// 			return false;
	// 		}

	// 		return (
	// 			/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i.test(url) ||
	// 			/^https?:\/\/youtu\.be\//i.test(url)
	// 		);
	// 	},
	// 	extractCommonFields(variant) {
	// 		return {
	// 			title: variant.title,
	// 			userTitle: variant.userTitle
	// 		};
	// 	},
	// 	async createVariant(cx) {
	// 		cx.nodeState._v.content.variant = {
	// 			type: 'youtube-video',
	// 			videoId: '',
	// 			title: cx.common.title,
	// 			userTitle: cx.common.userTitle
	// 		};
	// 		cx.nodeState._notify();
	// 		return Ok(undefined);
	// 	},
	// 	async enhanceVariant(cx) {
	// 		const videoId = extractYouTubeVideoId(cx.url) ?? '';
	// 		const variant = cx.nodeState._v.content.variant as TYouTubeVideoVariant;

	// 		if (videoId !== variant.videoId) {
	// 			variant.videoId = videoId;
	// 			cx.nodeState._notify();
	// 		}

	// 		return Ok(undefined);
	// 	}
	// } satisfies TLinkVariantMetadata<TYouTubeVideoVariant>,
	// 'youtube-channel': {
	// 	type: 'youtube-channel',
	// 	label: 'YouTube Channel',
	// 	isApplicable(url) {
	// 		if (!url.trim().length) {
	// 			return false;
	// 		}

	// 		return (
	// 			/^https?:\/\/(www\.)?youtube\.com\/channel\//i.test(url) ||
	// 			/^https?:\/\/(www\.)?youtube\.com\/@/i.test(url)
	// 		);
	// 	},
	// 	extractCommonFields(variant) {
	// 		return {
	// 			title: variant.title,
	// 			userTitle: variant.userTitle
	// 		};
	// 	},
	// 	async createVariant(cx) {
	// 		cx.nodeState._v.content.variant = {
	// 			type: 'youtube-channel',
	// 			channelId: '',
	// 			title: cx.common.title,
	// 			userTitle: cx.common.userTitle
	// 		};
	// 		cx.nodeState._notify();
	// 		return Ok(undefined);
	// 	},
	// 	async enhanceVariant(cx) {
	// 		// Extract channel ID from URL if possible
	// 		const channelId =
	// 			cx.url.match(/\/channel\/([^\/\?]+)/)?.[1] || cx.url.match(/\/@([^\/\?]+)/)?.[1] || '';
	// 		const variant = cx.nodeState._v.content.variant as TYouTubeChannelVariant;

	// 		if (channelId !== variant.channelId) {
	// 			variant.channelId = channelId;
	// 			cx.nodeState._notify();
	// 		}

	// 		return Ok(undefined);
	// 	}
	// } satisfies TLinkVariantMetadata<TYouTubeChannelVariant>,
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
		async createVariant(cx) {
			const videoId = extractYouTubeVideoId(cx.url) ?? '';
			cx.nodeState._v.content.variant = {
				type: 'youtube-video-embed',
				videoId
			};
			cx.nodeState._notify();
			return Ok(undefined);
		},
		async enhanceVariant(cx) {
			const videoId = extractYouTubeVideoId(cx.url) ?? '';
			const variant = cx.nodeState._v.content.variant as TYouTubeVideoEmbedVariant;

			if (videoId !== variant.videoId) {
				variant.videoId = videoId;
				cx.nodeState._notify();
			}

			return Ok(undefined);
		}
	} satisfies TLinkVariantMetadata<TYouTubeVideoEmbedVariant>
};

export const linkVariantMetadata = Object.values(linkVariantMetadataMap);

export type TVariantType = keyof typeof linkVariantMetadataMap;

export interface TLinkVariantMetadata<GVariant extends TLinkVariant = TLinkVariant> {
	type: GVariant['type'];
	label: string;
	isApplicable: (url: string) => boolean;
	/**
	 * Creates a new variant, modifying the nodeState directly
	 */
	createVariant: (cx: {
		url: string;
		common: TCommonVariantFields;
		editor: TPageEditor;
		shopify: ShopifyGlobal;
		nodeState: TNodeState<TLinkNode<GVariant>>;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Optional method to enhance the variant with additional data after creation or url change
	 */
	enhanceVariant?: (cx: {
		url: string;
		editor: TPageEditor;
		shopify: ShopifyGlobal;
		nodeState: TNodeState<TLinkNode<GVariant>>;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Extracts common fields from a variant of this type
	 */
	extractCommonFields: (variant: GVariant) => TCommonVariantFields;
}

interface TCommonVariantFields {
	title?: string;
	userTitle?: string;
	description?: string;
}

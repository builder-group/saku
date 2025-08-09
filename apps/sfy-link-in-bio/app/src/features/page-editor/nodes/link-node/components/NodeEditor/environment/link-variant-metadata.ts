import {
	TDefaultLinkVariant,
	TLinkVariant,
	TYouTubeChannelVariant,
	TYouTubeVideoEmbedVariant,
	TYouTubeVideoVariant
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { TPageEditor } from '../../../../../lib';
import { extractYouTubeVideoId, fetchUrlMetadata } from '../lib';

export const linkVariantMetadataMap = {
	'default': {
		type: 'default',
		label: 'Default',
		isApplicable: () => true, // Always available
		createVariant: async (cx) => {
			const metadata = await fetchUrlMetadata(cx.url, cx.shopify);

			let faviconHash: string | null = null;
			if (metadata?.favicon != null) {
				faviconHash = cx.editor.registerImage(metadata.favicon, 'favicon');
			}

			return {
				type: 'default',
				title: metadata?.title ?? cx.common.title,
				userTitle: cx.common.userTitle,
				description: metadata?.description ?? cx.common.description,
				favicon: faviconHash ?? undefined
			};
		},
		extractCommonFields(variant) {
			return {
				title: variant.title,
				userTitle: variant.userTitle
			};
		}
	} satisfies TLinkVariantMetadata<TDefaultLinkVariant>,
	'youtube-video': {
		type: 'youtube-video',
		label: 'YouTube Video',
		isApplicable: (url) => {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i.test(url) ||
				/^https?:\/\/youtu\.be\//i.test(url)
			);
		},
		createVariant: async (cx) => {
			return {
				type: 'youtube-video',
				videoId: '',
				title: cx.common.title,
				userTitle: cx.common.userTitle
			};
		},
		extractCommonFields(variant) {
			return {
				title: variant.title,
				userTitle: variant.userTitle
			};
		}
	} satisfies TLinkVariantMetadata<TYouTubeVideoVariant>,
	'youtube-channel': {
		type: 'youtube-channel',
		label: 'YouTube Channel',
		isApplicable: (url) => {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/channel\//i.test(url) ||
				/^https?:\/\/(www\.)?youtube\.com\/@/i.test(url)
			);
		},
		createVariant: async (cx) => {
			return {
				type: 'youtube-channel',
				channelId: '',
				title: cx.common.title,
				userTitle: cx.common.userTitle
			};
		},
		extractCommonFields(variant) {
			return {
				title: variant.title,
				userTitle: variant.userTitle
			};
		}
	} satisfies TLinkVariantMetadata<TYouTubeChannelVariant>,
	'youtube-video-embed': {
		type: 'youtube-video-embed',
		label: 'YouTube Video Embed',
		isApplicable: (url) => {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i.test(url) ||
				/^https?:\/\/youtu\.be\//i.test(url)
			);
		},
		createVariant: async (cx) => {
			const videoId = extractYouTubeVideoId(cx.url) ?? '';
			return {
				type: 'youtube-video-embed',
				videoId
			};
		},
		extractCommonFields() {
			return {};
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
	 * Creates a new variant instance, optionally pre-filled with common data
	 * Can be async to fetch initial data (e.g., metadata from URL)
	 */
	createVariant: (cx: {
		url: string;
		common: TCommonVariantFields;
		editor: TPageEditor;
		shopify: ShopifyGlobal;
	}) => Promise<GVariant>;
	/**
	 * Extracts common fields from a variant of this type
	 * Returns only the fields that this variant type supports
	 */
	extractCommonFields: (variant: GVariant) => TCommonVariantFields;
}

interface TCommonVariantFields {
	title?: string;
	userTitle?: string;
	description?: string;
}

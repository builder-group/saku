import {
	createSpotifyEmbedUrl,
	extractSpotifyId,
	extractYouTubeId,
	linkNodeMetadata,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TClassicLinkNodeBundle,
	TFeaturedLinkNodeBundle,
	TFillStyleMixin,
	TIdMixin,
	TImageStyleMixin,
	TLinkNode,
	tokenRef,
	TShadowStyleMixin,
	TSpotifyEmbedLinkNodeBundle,
	TStrokeStyleMixin,
	TTextSmStyleMixin,
	TTextStyleMixin,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { Err, Ok, type TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from '../../../../../mixins';
import { fetchSpotifyTheme, fetchUrlMetadata } from '../lib';

export const bundleMetadataMap = {
	'classic': {
		type: 'classic',
		label: 'Classic',
		isApplicable: () => true,
		extractCommonFields(node) {
			return {
				id: node.id,
				content: {
					title: node.content.title,
					userTitle: node.content.userTitle,
					description: node.content.description,
					userDescription: node.content.userDescription
				},
				autoLayout: node.autoLayout,
				appearance: node.appearance,
				fill: node.fill,
				stroke: node.stroke,
				shadow: node.shadow,
				text: node.text,
				textSm: node.textSm,
				image: node.image
			};
		},
		async update(cx) {
			const url = cx.node._v.content.url;
			const defaults = linkNodeMetadata.bundleMap['classic'];

			let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
			if (cx.common.autoLayout != null) {
				const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
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
				commonAutoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
			}

			cx.node.set({
				id: cx.common.id,
				bundleType: 'classic',
				type: 'link',
				content: {
					type: 'basic',
					url,
					title: cx.common.content?.title ?? defaults.content.title,
					userTitle: cx.common.content?.userTitle,
					description: cx.common.content?.description,
					userDescription: cx.common.content?.userDescription
				},
				autoLayout: commonAutoLayout ?? defaults.autoLayout,
				appearance: cx.common.appearance ?? defaults.appearance,
				fill: cx.common.fill ?? defaults.fill,
				stroke: cx.common.stroke ?? defaults.stroke,
				shadow: cx.common.shadow ?? defaults.shadow,
				text: cx.common.text ?? defaults.text,
				textSm: cx.common.textSm ?? defaults.textSm,
				image: cx.common.image ?? defaults.image
			} satisfies TClassicLinkNodeBundle);

			return Ok(undefined);
		},
		async enhance(cx) {
			const url = cx.node._v.content.url;
			const metadata = await fetchUrlMetadata(url, cx.editor.shopify);
			if (metadata == null) {
				return Err(
					new AppError('#ERR_FAILED_TO_FETCH_URL_METADATA', {
						detail: 'Failed to fetch URL metadata'
					})
				);
			}

			let imageHash: string | null = null;
			if (metadata.favicon != null) {
				imageHash = cx.editor.registerImage(metadata.favicon, 'favicon');
			}

			// Update fields with new metadata
			const content = cx.node._v.content;
			content.title = metadata.title;
			content.description = metadata.description;
			if (imageHash != null) {
				content.image = imageHash;
			}

			cx.node._notify();
			return Ok(undefined);
		}
	} satisfies TBundleMetadata<TClassicLinkNodeBundle>,
	'featured': {
		type: 'featured',
		label: 'Featured',
		isApplicable: () => true,
		extractCommonFields(node) {
			return {
				id: node.id,
				content: {
					title: node.content.title,
					userTitle: node.content.userTitle,
					description: node.content.description,
					userDescription: node.content.userDescription
				},
				autoLayout: node.autoLayout,
				appearance: node.appearance,
				fill: node.fill,
				stroke: node.stroke,
				shadow: node.shadow,
				text: node.text,
				textSm: node.textSm,
				image: node.image
			};
		},
		async update(cx) {
			const url = cx.node._v.content.url;
			const defaults = linkNodeMetadata.bundleMap['featured'];

			let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
			if (cx.common.autoLayout != null) {
				const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
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
				commonAutoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
			}

			cx.node.set({
				id: cx.common.id,
				bundleType: 'featured',
				type: 'link',
				content: {
					type: 'basic',
					url,
					title: cx.common.content?.title ?? defaults.content.title,
					userTitle: cx.common.content?.userTitle,
					description: cx.common.content?.description,
					userDescription: cx.common.content?.userDescription
				},
				autoLayout: commonAutoLayout ?? defaults.autoLayout,
				appearance: cx.common.appearance ?? defaults.appearance,
				fill: cx.common.fill ?? defaults.fill,
				stroke: cx.common.stroke ?? defaults.stroke,
				shadow: cx.common.shadow ?? defaults.shadow,
				text: cx.common.text ?? defaults.text,
				textSm: cx.common.textSm ?? defaults.textSm,
				image: cx.common.image ?? defaults.image
			} satisfies TFeaturedLinkNodeBundle);

			return Ok(undefined);
		},
		async enhance(cx) {
			const url = cx.node._v.content.url;
			const metadata = await fetchUrlMetadata(url, cx.editor.shopify);
			if (metadata == null) {
				return Err(
					new AppError('#ERR_FAILED_TO_FETCH_URL_METADATA', {
						detail: 'Failed to fetch URL metadata'
					})
				);
			}

			let imageHash: string | null = null;
			if (metadata.ogImage != null) {
				imageHash = cx.editor.registerImage(metadata.ogImage, 'og-image');
			}

			// Update fields with new metadata
			const content = cx.node._v.content;
			content.title = metadata.title;
			content.description = metadata.description;
			if (imageHash != null) {
				content.image = imageHash;
			}

			cx.node._notify();
			return Ok(undefined);
		}
	} satisfies TBundleMetadata<TFeaturedLinkNodeBundle>,
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
		extractCommonFields(node) {
			return {
				id: node.id,
				autoLayout: node.autoLayout,
				appearance: node.appearance,
				fill: node.fill,
				stroke: node.stroke,
				shadow: node.shadow,
				image: node.image
			};
		},
		async update(cx) {
			const url = cx.node._v.content.url;
			const youtubeData = extractYouTubeId(url);
			if (youtubeData == null) {
				return Err(
					new AppError('#ERR_INVALID_YOUTUBE_URL', {
						detail: 'Invalid YouTube URL'
					})
				);
			}

			const defaults = linkNodeMetadata.bundleMap['youtube-embed'];

			let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
			if (cx.common.autoLayout != null) {
				const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
				unpackedAutoLayout.horizontalPadding = 0;
				unpackedAutoLayout.verticalPadding = 0;
				commonAutoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
			}

			cx.node.set({
				id: cx.common.id,
				bundleType: 'youtube-embed',
				type: 'link',
				content: {
					type: 'youtube-embed',
					url,
					contentType: youtubeData.type,
					contentId: youtubeData.id
				},
				autoLayout: commonAutoLayout ?? defaults.autoLayout,
				appearance: cx.common.appearance ?? defaults.appearance,
				fill: cx.common.fill ?? defaults.fill,
				stroke: cx.common.stroke ?? defaults.stroke,
				shadow: cx.common.shadow ?? defaults.shadow,
				image: cx.common.image ?? defaults.image
			} satisfies TYouTubeEmbedLinkNodeBundle);

			return Ok(undefined);
		},
		async enhance(cx) {
			const url = cx.node._v.content.url;
			const youtubeData = extractYouTubeId(url);
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
	} satisfies TBundleMetadata<TYouTubeEmbedLinkNodeBundle>,
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
		extractCommonFields(node) {
			return {
				id: node.id,
				autoLayout: node.autoLayout,
				appearance: node.appearance,
				fill: node.fill,
				stroke: node.stroke,
				shadow: node.shadow,
				image: node.image
			};
		},
		async update(cx) {
			const url = cx.node._v.content.url;
			const spotifyData = extractSpotifyId(url);
			if (spotifyData == null) {
				return Err(
					new AppError('#ERR_INVALID_SPOTIFY_URL', {
						detail: 'Invalid Spotify URL'
					})
				);
			}

			const defaults = linkNodeMetadata.bundleMap['spotify-embed'];

			let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
			if (cx.common.autoLayout != null) {
				const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
				unpackedAutoLayout.horizontalPadding = 0;
				unpackedAutoLayout.verticalPadding = 0;
				commonAutoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
			}

			cx.node.set({
				id: cx.common.id,
				bundleType: 'spotify-embed',
				type: 'link',
				content: {
					type: 'spotify-embed',
					url,
					contentType: spotifyData.type,
					contentId: spotifyData.id,
					height: 152 // Default to compact height
				},
				autoLayout: commonAutoLayout ?? defaults.autoLayout,
				appearance: cx.common.appearance ?? defaults.appearance,
				fill: cx.common.fill ?? defaults.fill,
				stroke: cx.common.stroke ?? defaults.stroke,
				shadow: cx.common.shadow ?? defaults.shadow,
				image: cx.common.image ?? defaults.image
			} satisfies TSpotifyEmbedLinkNodeBundle);

			return Ok(undefined);
		},
		async enhance(cx) {
			const url = cx.node._v.content.url;
			const spotifyData = extractSpotifyId(url);
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
				cx.editor.shopify
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
	} satisfies TBundleMetadata<TSpotifyEmbedLinkNodeBundle>
};

export const bundleMetadata = Object.values(bundleMetadataMap);

export const bundlePriority: TBundleType[] = ['youtube-embed', 'spotify-embed', 'classic'];

export type TBundleType = TLinkNode['bundleType'];

export interface TBundleMetadata<GNode extends TLinkNode> {
	type: GNode['bundleType'];
	label: string;
	isApplicable: (url: string) => boolean;
	/**
	 * Creates a new node bundle, replacing the entire node with the new bundle
	 */
	update: (cx: {
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
	};
	autoLayout?: TAutoLayoutStyleMixin['value'];
	appearance?: TAppearanceStyleMixin['value'];
	fill?: TFillStyleMixin['value'];
	stroke?: TStrokeStyleMixin['value'];
	shadow?: TShadowStyleMixin['value'];
	text?: TTextStyleMixin['value'];
	textSm?: TTextSmStyleMixin['value'];
	image?: TImageStyleMixin['value'];
}

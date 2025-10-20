import {
	createSpotifyEmbedUrl,
	extractSpotifyId,
	linkNodeMetadata,
	TAutoLayoutStyleMixin,
	TSpotifyEmbedLinkNodeBundle
} from '@repo/editor';
import { Err, Ok } from 'tuple-result';
import { AppError } from '@/lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from '../../../../mixins';
import { TLinkNodeBundleMetadata } from '../../environment';
import { fetchSpotifyTheme } from '../../lib';

export const spotifyEmbedBundleMetadata: TLinkNodeBundleMetadata<TSpotifyEmbedLinkNodeBundle> = {
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
			embed: node.embed
		};
	},
	async switch(cx) {
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
			const unpackedDefaultAutoLayout = unpackAutoLayoutTokenRef(defaults.autoLayout);
			unpackedAutoLayout.paddingTop = unpackedDefaultAutoLayout.paddingTop;
			unpackedAutoLayout.paddingRight = unpackedDefaultAutoLayout.paddingRight;
			unpackedAutoLayout.paddingBottom = unpackedDefaultAutoLayout.paddingBottom;
			unpackedAutoLayout.paddingLeft = unpackedDefaultAutoLayout.paddingLeft;
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
			embed: cx.common.embed ?? defaults.embed
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
};

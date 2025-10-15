import {
	extractYouTubeId,
	linkNodeMetadata,
	TAutoLayoutStyleMixin,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { Err, Ok } from 'tuple-result';
import { AppError } from '@/lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from '../../../../mixins';
import { TLinkNodeBundleMetadata } from '../../environment';

export const youtubeEmbedBundleMetadata: TLinkNodeBundleMetadata<TYouTubeEmbedLinkNodeBundle> = {
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
	async switch(cx) {
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
};

import {
	linkNodeMetadata,
	TAutoLayoutStyleMixin,
	TFeaturedLinkNodeBundle,
	tokenRef
} from '@repo/editor';
import { Err, Ok } from 'tuple-result';
import { AppError } from '@/lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from '../../../../mixins';
import { TLinkNodeBundleMetadata } from '../../environment';
import { fetchUrlMetadata } from '../../lib';

export const featuredBundleMetadata: TLinkNodeBundleMetadata<TFeaturedLinkNodeBundle> = {
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
				userDescription: node.content.userDescription,
				thumbnail: node.content.thumbnail,
				userThumbnail: node.content.userThumbnail
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
	async switch(cx) {
		const url = cx.node._v.content.url;
		const defaults = linkNodeMetadata.bundleMap['featured'];

		let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
		if (cx.common.autoLayout != null) {
			const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
			unpackedAutoLayout.paddingTop = tokenRef('auto-layout.default', 'auto-layout', 'paddingTop');
			unpackedAutoLayout.paddingRight = tokenRef(
				'auto-layout.default',
				'auto-layout',
				'paddingRight'
			);
			unpackedAutoLayout.paddingBottom = tokenRef(
				'auto-layout.default',
				'auto-layout',
				'paddingBottom'
			);
			unpackedAutoLayout.paddingLeft = tokenRef(
				'auto-layout.default',
				'auto-layout',
				'paddingLeft'
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
				userDescription: cx.common.content?.userDescription,
				userThumbnail: cx.common.content?.userThumbnail
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

		let ogImageHash: string | null = null;
		if (metadata.ogImage != null) {
			ogImageHash = cx.editor.registerImage(metadata.ogImage, 'og-image');
		}

		// Update fields with new metadata
		const content = cx.node._v.content;
		content.title = metadata.title;
		content.description = metadata.description;
		if (ogImageHash != null) {
			content.thumbnail = ogImageHash;
		}

		cx.node._notify();
		return Ok(undefined);
	}
};

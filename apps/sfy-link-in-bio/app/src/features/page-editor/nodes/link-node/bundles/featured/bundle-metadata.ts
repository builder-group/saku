import { linkNodeMetadata, TAutoLayoutStyleMixin, TFeaturedLinkNodeBundle } from '@repo/editor';
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
				metadata: {
					title: node.content.metadata?.title,
					description: node.content.metadata?.description,
					thumbnail: node.content.metadata?.thumbnail
				},
				overrides: {
					title: node.content.overrides.title,
					description: node.content.overrides.description,
					thumbnail: node.content.overrides.thumbnail
				}
			},
			autoLayout: node.autoLayout,
			appearance: node.appearance,
			fill: node.fill,
			stroke: node.stroke,
			shadow: node.shadow,
			animation: node.animation,
			textBody: node.textBody,
			textCaption: node.textCaption,
			image: node.image
		};
	},
	async switch(cx) {
		const url = cx.node._v.content.url;
		const defaults = linkNodeMetadata.bundleMap['featured'];

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
			bundleType: 'featured',
			type: 'link',
			content: {
				type: 'basic',
				url,
				metadata: {
					title: cx.common.content?.metadata?.title ?? defaults.content.metadata?.title,
					description:
						cx.common.content?.metadata?.description ?? defaults.content.metadata?.description,
					thumbnail: cx.common.content?.metadata?.thumbnail ?? defaults.content.metadata?.thumbnail
				},
				overrides: {
					title: cx.common.content?.overrides.title ?? defaults.content.overrides.title,
					description:
						cx.common.content?.overrides.description ?? defaults.content.overrides.description,
					thumbnail: cx.common.content?.overrides.thumbnail ?? defaults.content.overrides.thumbnail
				}
			},
			autoLayout: commonAutoLayout ?? defaults.autoLayout,
			appearance: cx.common.appearance ?? defaults.appearance,
			fill: cx.common.fill ?? defaults.fill,
			stroke: cx.common.stroke ?? defaults.stroke,
			shadow: cx.common.shadow ?? defaults.shadow,
			animation: cx.common.animation ?? defaults.animation,
			textBody: cx.common.textBody ?? defaults.textBody,
			textCaption: cx.common.textCaption ?? defaults.textCaption,
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
			ogImageHash = cx.editor.registerImage(metadata.ogImage);
		}

		cx.node._v.content.metadata = {
			title: metadata.title,
			description: metadata.description,
			thumbnail: ogImageHash != null ? ogImageHash : undefined
		};
		cx.node._notify();

		return Ok(undefined);
	}
};

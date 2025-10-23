import { linkNodeMetadata, TAutoLayoutStyleMixin, TClassicLinkNodeBundle } from '@repo/editor';
import { Err, Ok } from 'tuple-result';
import { AppError } from '@/lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from '../../../../mixins';
import { TLinkNodeBundleMetadata } from '../../environment';
import { fetchUrlMetadata } from '../../lib';

export const classicBundleMetadata: TLinkNodeBundleMetadata<TClassicLinkNodeBundle> = {
	type: 'classic',
	label: 'Classic',
	isApplicable: () => true,
	extractCommonFields(node) {
		return {
			id: node.id,
			content: {
				metadata: {
					title: node.content.metadata.title,
					description: node.content.metadata.description,
					thumbnail: node.content.metadata.thumbnail
				},
				user: {
					title: node.content.user.title,
					description: node.content.user.description,
					thumbnail: node.content.user.thumbnail
				}
			},
			autoLayout: node.autoLayout,
			appearance: node.appearance,
			fill: node.fill,
			stroke: node.stroke,
			shadow: node.shadow,
			textBody: node.textBody,
			textCaption: node.textCaption,
			image: node.image
		};
	},
	async switch(cx) {
		const url = cx.node._v.content.url;
		const defaults = linkNodeMetadata.bundleMap['classic'];

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
			bundleType: 'classic',
			type: 'link',
			content: {
				type: 'basic',
				url,
				metadata: {
					title: cx.common.content?.metadata.title ?? defaults.content.metadata.title,
					description:
						cx.common.content?.metadata.description ?? defaults.content.metadata.description,
					thumbnail: cx.common.content?.metadata.thumbnail ?? defaults.content.metadata.thumbnail
				},
				user: {
					title: cx.common.content?.user.title ?? defaults.content.user.title,
					description: cx.common.content?.user.description ?? defaults.content.user.description,
					thumbnail: cx.common.content?.user.thumbnail ?? defaults.content.user.thumbnail
				}
			},
			autoLayout: commonAutoLayout ?? defaults.autoLayout,
			appearance: cx.common.appearance ?? defaults.appearance,
			fill: cx.common.fill ?? defaults.fill,
			stroke: cx.common.stroke ?? defaults.stroke,
			shadow: cx.common.shadow ?? defaults.shadow,
			textBody: cx.common.textBody ?? defaults.textBody,
			textCaption: cx.common.textCaption ?? defaults.textCaption,
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

		let faviconHash: string | null = null;
		if (metadata.favicon != null) {
			faviconHash = cx.editor.registerImage(metadata.favicon, 'favicon');
		}

		cx.node._v.content.metadata = {
			title: metadata.title,
			description: metadata.description,
			thumbnail: faviconHash != null ? faviconHash : undefined
		};
		cx.node._notify();

		return Ok(undefined);
	}
};

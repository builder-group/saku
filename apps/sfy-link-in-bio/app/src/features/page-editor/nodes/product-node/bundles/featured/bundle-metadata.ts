import { productNodeMetadata, TFeaturedProductNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TProductNodeBundleMetadata } from '../../environment';

export const featuredBundleMetadata: TProductNodeBundleMetadata<TFeaturedProductNodeBundle> = {
	type: 'featured',
	label: 'Featured',
	extractCommonFields(node) {
		return {
			id: node.id,
			content: {
				product: node.content.product,
				banner: node.content.banner,
				cta: node.content.cta,
				variants: node.content.variants,
				overrides: node.content.overrides,
				integrationId: node.content.integrationId
			},
			autoLayout: node.autoLayout,
			appearance: node.appearance,
			fill: node.fill,
			stroke: node.stroke,
			shadow: node.shadow,
			textBody: node.textBody,
			buttonPrimary: node.buttonPrimary,
			badgeSecondary: node.badgeSecondary,
			badgeNeutral: node.badgeNeutral,
			banner: node.banner,
			image: node.image,
			productDetails: node.productDetails
		};
	},
	async switch(cx) {
		const defaults = productNodeMetadata.bundleMap['featured'];
		cx.node.set({
			id: cx.common.id,
			bundleType: 'featured',
			type: 'product',
			content: {
				type: 'single',
				product: cx.common.content?.product ?? defaults.content.product,
				banner: cx.common.content?.banner ?? defaults.content.banner,
				cta: cx.common.content?.cta ?? defaults.content.cta,
				variants: cx.common.content?.variants ?? defaults.content.variants,
				overrides: cx.common.content?.overrides ?? defaults.content.overrides,
				integrationId: cx.common.content?.integrationId ?? defaults.content.integrationId
			},
			autoLayout: cx.common.autoLayout ?? defaults.autoLayout,
			appearance: cx.common.appearance ?? defaults.appearance,
			fill: cx.common.fill ?? defaults.fill,
			stroke: cx.common.stroke ?? defaults.stroke,
			shadow: cx.common.shadow ?? defaults.shadow,
			textBody: cx.common.textBody ?? defaults.textBody,
			buttonPrimary: cx.common.buttonPrimary ?? defaults.buttonPrimary,
			badgeSecondary: cx.common.badgeSecondary ?? defaults.badgeSecondary,
			badgeNeutral: cx.common.badgeNeutral ?? defaults.badgeNeutral,
			banner: cx.common.banner ?? defaults.banner,
			image: cx.common.image ?? defaults.image,
			productDetails: cx.common.productDetails ?? defaults.productDetails
		});
		return Ok(undefined);
	}
};

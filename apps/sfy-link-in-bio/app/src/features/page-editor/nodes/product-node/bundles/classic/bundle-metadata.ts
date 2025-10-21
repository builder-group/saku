import { productNodeMetadata, TClassicProductNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TProductNodeBundleMetadata } from '../../environment';

export const classicBundleMetadata: TProductNodeBundleMetadata<TClassicProductNodeBundle> = {
	type: 'classic',
	label: 'Classic',
	extractCommonFields(node) {
		return {
			id: node.id
		};
	},
	async switch(cx) {
		const defaults = productNodeMetadata.bundleMap['classic'];

		cx.node.set({
			id: cx.common.id,
			bundleType: 'classic',
			type: 'product',
			content: defaults.content,
			autoLayout: defaults.autoLayout,
			appearance: defaults.appearance,
			fill: defaults.fill,
			stroke: defaults.stroke,
			shadow: defaults.shadow,
			textBody: defaults.textBody,
			buttonPrimary: defaults.buttonPrimary,
			badgeSecondary: defaults.badgeSecondary,
			badgeNeutral: defaults.badgeNeutral,
			image: defaults.image,
			productDetails: defaults.productDetails
		});
		return Ok(undefined);
	}
};

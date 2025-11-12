import { mediaNodeMetadata, TClassicMediaNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TMediaNodeBundleMetadata } from '../../environment';

export const classicBundleMetadata: TMediaNodeBundleMetadata<TClassicMediaNodeBundle> = {
	type: 'classic',
	label: 'Classic',
	extractCommonFields(node) {
		return {
			id: node.id
		};
	},
	async switch(cx) {
		const defaults = mediaNodeMetadata.bundleMap['classic'];
		cx.node.set({
			id: cx.common.id,
			bundleType: 'classic',
			type: 'media',
			content: defaults.content,
			autoLayout: defaults.autoLayout,
			appearance: defaults.appearance,
			fill: defaults.fill,
			stroke: defaults.stroke,
			shadow: defaults.shadow,
			animation: defaults.animation,
			image: defaults.image
		});
		return Ok(undefined);
	}
};

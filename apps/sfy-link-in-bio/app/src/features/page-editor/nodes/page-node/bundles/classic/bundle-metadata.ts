import { pageNodeMetadata, TClassicFlatPageNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TPageNodeBundleMetadata } from '../../environment';

export const classicBundleMetadata: TPageNodeBundleMetadata<TClassicFlatPageNodeBundle> = {
	type: 'classic',
	label: 'Classic',
	extractCommonFields(node) {
		return {
			id: node.id
		};
	},
	async switch(cx) {
		const defaults = pageNodeMetadata.bundleMap['classic'];
		cx.node.set({
			id: cx.common.id,
			bundleType: 'classic',
			type: 'page',
			metadata: defaults.metadata,
			watermarkVisible: defaults.watermarkVisible,
			children: defaults.children,
			content: defaults.content,
			autoLayout: defaults.autoLayout,
			appearance: defaults.appearance,
			fill: defaults.fill,
			textSm: defaults.textSm
		});
		return Ok(undefined);
	}
};

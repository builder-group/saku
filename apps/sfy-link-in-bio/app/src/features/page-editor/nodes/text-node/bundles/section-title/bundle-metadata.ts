import { textNodeMetadata, TSectionTitleTextNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TTextNodeBundleMetadata } from '../../environment';

export const sectionTitleBundleMetadata: TTextNodeBundleMetadata<TSectionTitleTextNodeBundle> = {
	type: 'section-title',
	label: 'Section Title',
	extractCommonFields(node) {
		return {
			id: node.id,
			content: {
				text: { type: 'text', value: node.content.text }
			},
			autoLayout: node.autoLayout,
			appearance: node.appearance
		};
	},
	async switch(cx) {
		const defaults = textNodeMetadata.bundleMap['section-title'];
		cx.node.set({
			id: cx.common.id,
			bundleType: 'section-title',
			type: 'text',
			content: {
				type: 'basic',
				text: cx.common.content?.text.value ?? defaults.content.text
			},
			autoLayout: defaults.autoLayout,
			appearance: cx.common.appearance ?? defaults.appearance,
			textXl: defaults.textXl
		});
		return Ok(undefined);
	}
};

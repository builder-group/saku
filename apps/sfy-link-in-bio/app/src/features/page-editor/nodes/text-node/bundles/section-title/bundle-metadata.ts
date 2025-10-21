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
			appearance: node.appearance,
			textHeading: node.textHeading
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
			textHeading: cx.common.textHeading ?? defaults.textHeading
		});
		return Ok(undefined);
	}
};

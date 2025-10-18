import { textNodeMetadata, TRichTextNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TTextNodeBundleMetadata } from '../../environment';

export const richBundleMetadata: TTextNodeBundleMetadata<TRichTextNodeBundle> = {
	type: 'rich',
	label: 'Rich',
	extractCommonFields(node) {
		return {
			id: node.id
		};
	},
	async switch(cx) {
		const defaults = textNodeMetadata.bundleMap['rich'];
		cx.node.set({
			id: cx.common.id,
			bundleType: 'rich',
			type: 'text',
			content: defaults.content,
			autoLayout: defaults.autoLayout,
			appearance: defaults.appearance,
			fill: defaults.fill,
			stroke: defaults.stroke,
			shadow: defaults.shadow,
			text: defaults.text
		});
		return Ok(undefined);
	}
};

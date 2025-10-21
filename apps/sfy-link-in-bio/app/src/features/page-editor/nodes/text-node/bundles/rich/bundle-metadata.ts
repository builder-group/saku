import { textNodeMetadata, TRichTextNodeBundle } from '@repo/editor';
import { Ok } from 'tuple-result';
import { TTextNodeBundleMetadata } from '../../environment';

export const richBundleMetadata: TTextNodeBundleMetadata<TRichTextNodeBundle> = {
	type: 'rich',
	label: 'Rich',
	extractCommonFields(node) {
		return {
			id: node.id,
			content: node.content,
			autoLayout: node.autoLayout,
			appearance: node.appearance,
			fill: node.fill,
			stroke: node.stroke,
			shadow: node.shadow,
			textBody: node.textBody
		};
	},
	async switch(cx) {
		const defaults = textNodeMetadata.bundleMap['rich'];
		cx.node.set({
			id: cx.common.id,
			bundleType: 'rich',
			type: 'text',
			content: {
				type: 'rich',
				text: cx.common.content?.text ?? defaults.content.text
			},
			autoLayout: defaults.autoLayout,
			appearance: cx.common.appearance ?? defaults.appearance,
			fill: cx.common.fill ?? defaults.fill,
			stroke: cx.common.stroke ?? defaults.stroke,
			shadow: cx.common.shadow ?? defaults.shadow,
			textBody: cx.common.textBody ?? defaults.textBody
		});
		return Ok(undefined);
	}
};

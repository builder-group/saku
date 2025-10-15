import { aboutNodeMetadata, THeroAboutNodeBundle, TTextXlStyleMixin } from '@repo/editor';
import { Ok } from 'tuple-result';
import {
	packTextTokenRef,
	packTypographyTokenRef,
	unpackTextTokenRef,
	unpackTypographyTokenRef
} from '../../../../mixins';
import { TAboutNodeBundleMetadata } from '../../environment';

export const heroBundleMetadata: TAboutNodeBundleMetadata<THeroAboutNodeBundle> = {
	type: 'hero',
	label: 'Hero',
	extractCommonFields(node) {
		return {
			id: node.id,
			content: {
				title: node.content.title,
				description: node.content.description,
				avatar: node.content.avatar,
				contactLinks: node.content.contactLinks
			},
			autoLayout: node.autoLayout,
			appearance: node.appearance,
			fill: node.fill,
			stroke: node.stroke,
			shadow: node.shadow,
			textXl: node.textXl,
			text: node.text,
			image: node.image
		};
	},
	async switch(cx) {
		const defaults = aboutNodeMetadata.bundleMap['hero'];

		let commonTextXl: TTextXlStyleMixin['value'] | null = null;
		if (cx.common.textXl != null) {
			const unpackedTextXl = unpackTextTokenRef(cx.common.textXl);
			const unpackedTypography = unpackTypographyTokenRef(unpackedTextXl.typography);
			unpackedTypography.fontSize = 40;
			unpackedTextXl.typography = packTypographyTokenRef(unpackedTypography);
			commonTextXl = packTextTokenRef(unpackedTextXl);
		}

		cx.node.set({
			id: cx.common.id,
			bundleType: 'hero',
			type: 'about',
			content: {
				type: 'basic',
				title: cx.common.content?.title ?? '',
				description: cx.common.content?.description,
				avatar: cx.common.content?.avatar,
				contactLinks: cx.common.content?.contactLinks ?? []
			},
			autoLayout: cx.common.autoLayout ?? defaults.autoLayout,
			appearance: cx.common.appearance ?? defaults.appearance,
			fill: cx.common.fill ?? defaults.fill,
			stroke: cx.common.stroke ?? defaults.stroke,
			shadow: cx.common.shadow ?? defaults.shadow,
			textXl: commonTextXl ?? defaults.textXl,
			text: cx.common.text ?? defaults.text,
			image: cx.common.image ?? defaults.image
		});
		return Ok(undefined);
	}
};

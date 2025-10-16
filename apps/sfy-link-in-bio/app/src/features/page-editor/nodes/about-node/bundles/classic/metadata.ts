import {
	aboutNodeMetadata,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TClassicAboutNodeBundle,
	tokenRef,
	TTextXlStyleMixin
} from '@repo/editor';
import { Ok } from 'tuple-result';
import {
	packAppearanceTokenRef,
	packAutoLayoutTokenRef,
	packTextTokenRef,
	packTypographyTokenRef,
	unpackAppearanceTokenRef,
	unpackAutoLayoutTokenRef,
	unpackTextTokenRef,
	unpackTypographyTokenRef
} from '../../../../mixins';
import { TAboutNodeBundleMetadata } from '../../environment';

export const classicBundleMetadata: TAboutNodeBundleMetadata<TClassicAboutNodeBundle> = {
	type: 'classic',
	label: 'Classic',
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
		const defaults = aboutNodeMetadata.bundleMap['classic'];

		let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
		if (cx.common.autoLayout != null) {
			const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
			unpackedAutoLayout.marginTop = 96;
			unpackedAutoLayout.marginRight = tokenRef(
				'auto-layout.default',
				'auto-layout',
				'marginRight'
			);
			unpackedAutoLayout.marginLeft = tokenRef('auto-layout.default', 'auto-layout', 'marginLeft');
			commonAutoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
		}

		let commonAppearance: TAppearanceStyleMixin['value'] | null = null;
		if (cx.common.appearance != null) {
			const unpackedAppearance = unpackAppearanceTokenRef(cx.common.appearance);
			unpackedAppearance.borderRadius = tokenRef(
				'appearance.default',
				'appearance',
				'borderRadius'
			);
			commonAppearance = packAppearanceTokenRef(unpackedAppearance);
		}

		let commonTextXl: TTextXlStyleMixin['value'] | null = null;
		if (cx.common.textXl != null) {
			const unpackedTextXl = unpackTextTokenRef(cx.common.textXl);
			const unpackedTypography = unpackTypographyTokenRef(unpackedTextXl.typography);
			unpackedTypography.fontSize = tokenRef('text.xl', 'text', 'typography.fontSize');
			unpackedTextXl.typography = packTypographyTokenRef(unpackedTypography);
			commonTextXl = packTextTokenRef(unpackedTextXl);
		}

		cx.node.set({
			id: cx.common.id,
			bundleType: 'classic',
			type: 'about',
			content: {
				type: 'basic',
				title: cx.common.content?.title ?? '',
				description: cx.common.content?.description,
				avatar: cx.common.content?.avatar,
				contactLinks: cx.common.content?.contactLinks ?? []
			},
			autoLayout: commonAutoLayout ?? defaults.autoLayout,
			appearance: commonAppearance ?? defaults.appearance,
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

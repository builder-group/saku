import {
	aboutNodeMetadata,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	THeroAboutNodeBundle,
	TTextHeadingStyleMixin
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
			textHeading: node.textHeading,
			textBody: node.textBody
		};
	},
	async switch(cx) {
		const defaults = aboutNodeMetadata.bundleMap['hero'];

		// Update page padding top if the about node is the first child
		const rootNode = cx.editor.getRootNode();
		if (rootNode._v.children[0] === cx.node._v.id) {
			const rootNodeAutoLayout = unpackAutoLayoutTokenRef(rootNode._v.autoLayout);
			rootNodeAutoLayout.paddingTop = 0;
			rootNode._v.autoLayout = packAutoLayoutTokenRef(rootNodeAutoLayout);
			rootNode._notify();
		}

		let commonAutoLayout: TAutoLayoutStyleMixin['value'] | null = null;
		if (cx.common.autoLayout != null) {
			const unpackedAutoLayout = unpackAutoLayoutTokenRef(cx.common.autoLayout);
			const unpackedDefaultAutoLayout = unpackAutoLayoutTokenRef(defaults.autoLayout);
			unpackedAutoLayout.paddingTop = unpackedDefaultAutoLayout.paddingTop;
			unpackedAutoLayout.paddingBottom = unpackedDefaultAutoLayout.paddingBottom;
			unpackedAutoLayout.marginRight = unpackedDefaultAutoLayout.marginRight;
			unpackedAutoLayout.marginLeft = unpackedDefaultAutoLayout.marginLeft;
			commonAutoLayout = packAutoLayoutTokenRef(unpackedAutoLayout);
		}

		let commonAppearance: TAppearanceStyleMixin['value'] | null = null;
		if (cx.common.appearance != null) {
			const unpackedAppearance = unpackAppearanceTokenRef(cx.common.appearance);
			const unpackedDefaultAppearance = unpackAppearanceTokenRef(defaults.appearance);
			unpackedAppearance.borderRadius = unpackedDefaultAppearance.borderRadius;
			commonAppearance = packAppearanceTokenRef(unpackedAppearance);
		}

		let commonTextHeading: TTextHeadingStyleMixin['value'] | null = null;
		if (cx.common.textHeading != null) {
			const unpackedTextHeading = unpackTextTokenRef(cx.common.textHeading);
			const unpackedTypography = unpackTypographyTokenRef(unpackedTextHeading.typography);
			const unpackedDefaultTypography = unpackTypographyTokenRef(
				unpackTextTokenRef(defaults.textHeading).typography
			);
			unpackedTypography.fontSize = unpackedDefaultTypography.fontSize;
			unpackedTextHeading.typography = packTypographyTokenRef(unpackedTypography);
			commonTextHeading = packTextTokenRef(unpackedTextHeading);
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
			autoLayout: commonAutoLayout ?? defaults.autoLayout,
			appearance: commonAppearance ?? defaults.appearance,
			fill: cx.common.fill ?? defaults.fill,
			stroke: cx.common.stroke ?? defaults.stroke,
			shadow: cx.common.shadow ?? defaults.shadow,
			textHeading: commonTextHeading ?? defaults.textHeading,
			textBody: cx.common.textBody ?? defaults.textBody
		});
		return Ok(undefined);
	}
};

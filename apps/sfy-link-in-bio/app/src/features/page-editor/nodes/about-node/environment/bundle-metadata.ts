import {
	aboutNodeMetadata,
	TAboutNode,
	TAppearanceStyleMixin,
	TAssetHash,
	TAutoLayoutStyleMixin,
	TClassicAboutNodeBundle,
	TContactLink,
	TFillStyleMixin,
	THeroAboutNodeBundle,
	TIdMixin,
	TImageStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextSmStyleMixin,
	TTextStyleMixin
} from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';

export const aboutNodeBundleMetadataMap = {
	classic: {
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
			const defaults = aboutNodeMetadata.bundleMap['hero'];
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
				autoLayout: cx.common.autoLayout ?? defaults.autoLayout,
				appearance: cx.common.appearance ?? defaults.appearance,
				fill: cx.common.fill ?? defaults.fill,
				stroke: cx.common.stroke ?? defaults.stroke,
				shadow: cx.common.shadow ?? defaults.shadow,
				textXl: cx.common.textXl ?? defaults.textXl,
				text: cx.common.text ?? defaults.text,
				image: cx.common.image ?? defaults.image
			});
			return Ok(undefined);
		}
	} satisfies TAboutNodeBundleMetadata<TClassicAboutNodeBundle>,
	hero: {
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
				textXl: cx.common.textXl ?? defaults.textXl,
				text: cx.common.text ?? defaults.text,
				image: cx.common.image ?? defaults.image
			});
			return Ok(undefined);
		}
	} satisfies TAboutNodeBundleMetadata<THeroAboutNodeBundle>
};

export const aboutNodeBundleMetadata = Object.values(aboutNodeBundleMetadataMap);

export const aboutNodeBundlePriority: TBundleType[] = ['classic', 'hero'];

export type TBundleType = TAboutNode['bundleType'];

export interface TAboutNodeBundleMetadata<GNode extends TAboutNode> {
	type: GNode['bundleType'];
	label: string;
	/**
	 * Creates a new node bundle, replacing the entire node with the new bundle
	 */
	switch: (cx: {
		node: TNodeState<GNode>;
		common: TCommonFields;
		editor: TPageEditor;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Extracts common fields from a node bundle
	 */
	extractCommonFields: (node: GNode) => TCommonFields;
}

interface TCommonFields {
	id: TIdMixin['value'];
	content?: {
		title: string;
		description?: string;
		avatar?: TAssetHash;
		contactLinks: TContactLink[];
	};
	autoLayout?: TAutoLayoutStyleMixin['value'];
	appearance?: TAppearanceStyleMixin['value'];
	fill?: TFillStyleMixin['value'];
	stroke?: TStrokeStyleMixin['value'];
	shadow?: TShadowStyleMixin['value'];
	textXl?: TTextSmStyleMixin['value'];
	text?: TTextStyleMixin['value'];
	image?: TImageStyleMixin['value'];
}

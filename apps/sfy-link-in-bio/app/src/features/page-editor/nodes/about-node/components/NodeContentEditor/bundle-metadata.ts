import {
	aboutNodeMetadata,
	TAboutNode,
	TAppearanceStyleMixin,
	TAssetHash,
	TAutoLayoutStyleMixin,
	TClassicAboutNodeBundle,
	TContactIcon,
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
import { AppError } from '../../../../../../lib';
import { TNodeState, TPageEditor } from '../../../../lib';

export const bundleMetadataMap = {
	classic: {
		type: 'classic',
		label: 'Classic',
		isApplicable: () => true,
		extractCommonFields(node) {
			return {
				id: node.id,
				content: {
					name: node.content.name,
					bio: node.content.bio,
					avatar: node.content.avatar,
					contactIcons: node.content.contactIcons
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
					name: cx.common.content?.name ?? '',
					bio: cx.common.content?.bio,
					avatar: cx.common.content?.avatar,
					contactIcons: cx.common.content?.contactIcons ?? []
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
	} satisfies TBundleMetadata<TClassicAboutNodeBundle>,
	hero: {
		type: 'hero',
		label: 'Hero',
		isApplicable: () => true,
		extractCommonFields(node) {
			return {
				id: node.id,
				content: {
					name: node.content.name,
					bio: node.content.bio,
					avatar: node.content.avatar,
					contactIcons: node.content.contactIcons
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
					name: cx.common.content?.name ?? '',
					bio: cx.common.content?.bio,
					avatar: cx.common.content?.avatar,
					contactIcons: cx.common.content?.contactIcons ?? []
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
	} satisfies TBundleMetadata<THeroAboutNodeBundle>
};

export const bundleMetadata = Object.values(bundleMetadataMap);

export const bundlePriority: TBundleType[] = ['classic', 'hero'];

export type TBundleType = TAboutNode['bundleType'];

export interface TBundleMetadata<GNode extends TAboutNode> {
	type: GNode['bundleType'];
	label: string;
	isApplicable: () => boolean;
	/**
	 * Creates a new node bundle, replacing the entire node with the new bundle
	 */
	switch: (cx: {
		node: TNodeState<GNode>;
		common: TCommonFields;
		editor: TPageEditor;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Optional method to enhance the node bundle with additional data after creation or url change
	 */
	enhance?: (cx: {
		node: TNodeState<GNode>;
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
		name: string;
		bio?: string;
		avatar?: TAssetHash;
		contactIcons: TContactIcon[];
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

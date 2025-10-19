import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TFillStyleMixin,
	TIdMixin,
	TRichContent,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextNode
} from '@repo/editor';
import { TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { richBundleMetadata, sectionTitleBundleMetadata } from '../bundles';

export const textNodeBundleMetadataMap = {
	'rich': richBundleMetadata,
	'section-title': sectionTitleBundleMetadata
};

export const textNodeBundleMetadata = Object.values(textNodeBundleMetadataMap);

export interface TTextNodeBundleMetadata<GNode extends TTextNode> {
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
		text: TRichContent;
	};
	autoLayout?: TAutoLayoutStyleMixin['value'];
	appearance?: TAppearanceStyleMixin['value'];
	fill?: TFillStyleMixin['value'];
	stroke?: TStrokeStyleMixin['value'];
	shadow?: TShadowStyleMixin['value'];
}

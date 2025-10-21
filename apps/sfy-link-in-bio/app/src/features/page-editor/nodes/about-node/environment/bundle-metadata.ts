import {
	TAboutNode,
	TAppearanceStyleMixin,
	TAssetHash,
	TAutoLayoutStyleMixin,
	TContactLink,
	TFillStyleMixin,
	TIdMixin,
	TImageStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextBodyStyleMixin,
	TTextHeadingStyleMixin
} from '@repo/editor';
import { TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { classicBundleMetadata, heroBundleMetadata } from '../bundles';

export const aboutNodeBundleMetadataMap = {
	classic: classicBundleMetadata,
	hero: heroBundleMetadata
};

export const aboutNodeBundleMetadata = Object.values(aboutNodeBundleMetadataMap);

export interface TAboutNodeBundleMetadata<GNode extends TAboutNode = TAboutNode> {
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
	textHeading?: TTextHeadingStyleMixin['value'];
	textBody?: TTextBodyStyleMixin['value'];
	image?: TImageStyleMixin['value'];
}

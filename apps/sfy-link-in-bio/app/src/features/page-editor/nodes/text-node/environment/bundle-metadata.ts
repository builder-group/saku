import { TIdMixin, TTextNode } from '@repo/editor';
import { TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { richBundleMetadata } from '../bundles';

export const textNodeBundleMetadataMap = {
	rich: richBundleMetadata
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
}

import { TIdMixin, TProductNode } from '@repo/editor';
import { TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { classicBundleMetadata } from '../bundles';

export const productNodeBundleMetadataMap = {
	classic: classicBundleMetadata
};

export const productNodeBundleMetadata = Object.values(productNodeBundleMetadataMap);

export interface TProductNodeBundleMetadata<GNode extends TProductNode = TProductNode> {
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

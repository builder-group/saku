import { TIdMixin, TMediaNode } from '@repo/editor';
import { TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { classicBundleMetadata } from '../bundles';

export const mediaNodeBundleMetadataMap = {
	classic: classicBundleMetadata
};

export const mediaNodeBundleMetadata = Object.values(mediaNodeBundleMetadataMap);

export interface TMediaNodeBundleMetadata<GNode extends TMediaNode> {
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

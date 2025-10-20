import { TProductNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { productNodeBundleMetadataMap, TProductNodeBundleMetadata } from '../environment';

export function createProductNodeEditorContext<GNode extends TProductNode = TProductNode>(
	config: TCreateProductNodeEditorContextConfig<GNode>
): TProductNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TProductNode['bundleType']>(node._v.bundleType),
		isSwitchingBundle: createState(false),

		async switchBundleType(this: TProductNodeEditorContext, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = productNodeBundleMetadataMap[
				this.node._v.bundleType
			] as TProductNodeBundleMetadata;
			const nextMetadata = productNodeBundleMetadataMap[bundleType] as TProductNodeBundleMetadata;

			try {
				// Update node bundle
				const updateResult = await nextMetadata.switch({
					node: this.node,
					common: metadata.extractCommonFields(this.node._v),
					editor
				});
				if (updateResult.isErr()) {
					return Err(new AppError('#ERR_FAILED_TO_CREATE_VARIANT'));
				}
			} finally {
				this.isSwitchingBundle.set(false);
			}

			return Ok(undefined);
		}
	};
}

export interface TCreateProductNodeEditorContextConfig<GNode extends TProductNode = TProductNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TProductNodeEditorContext<GNode extends TProductNode = TProductNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TProductNode['bundleType'], []>;
	isSwitchingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TProductNode['bundleType']) => Promise<TResult<void, AppError>>;
}

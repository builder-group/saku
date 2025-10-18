import { TFlatPageNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { pageNodeBundleMetadataMap, TPageNodeBundleMetadata } from '../environment';

export function createPageNodeEditorContext<GNode extends TFlatPageNode>(
	config: TCreatePageNodeEditorContextConfig<GNode>
): TPageNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TFlatPageNode['bundleType']>(node._v.bundleType),
		isSwitchingBundle: createState(false),

		async switchBundleType(this: TPageNodeEditorContext<GNode>, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = pageNodeBundleMetadataMap[
				this.node._v.bundleType
			] as TPageNodeBundleMetadata<GNode>;
			const nextMetadata = pageNodeBundleMetadataMap[bundleType] as TPageNodeBundleMetadata<GNode>;

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

export interface TCreatePageNodeEditorContextConfig<GNode extends TFlatPageNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TPageNodeEditorContext<GNode extends TFlatPageNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TFlatPageNode['bundleType'], []>;
	isSwitchingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TFlatPageNode['bundleType']) => Promise<TResult<void, AppError>>;
}

import { TMediaNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { mediaNodeBundleMetadataMap, TMediaNodeBundleMetadata } from '../environment';

export function createMediaNodeEditorContext<GNode extends TMediaNode>(
	config: TCreateMediaNodeEditorContextConfig<GNode>
): TMediaNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TMediaNode['bundleType']>(node._v.bundleType),
		isSwitchingBundle: createState(false),

		async switchBundleType(this: TMediaNodeEditorContext<GNode>, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = mediaNodeBundleMetadataMap[
				this.node._v.bundleType
			] as TMediaNodeBundleMetadata<GNode>;
			const nextMetadata = mediaNodeBundleMetadataMap[
				bundleType
			] as TMediaNodeBundleMetadata<GNode>;

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

export interface TCreateMediaNodeEditorContextConfig<GNode extends TMediaNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TMediaNodeEditorContext<GNode extends TMediaNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TMediaNode['bundleType'], []>;
	isSwitchingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TMediaNode['bundleType']) => Promise<TResult<void, AppError>>;
}

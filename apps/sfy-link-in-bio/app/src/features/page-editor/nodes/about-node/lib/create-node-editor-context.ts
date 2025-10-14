import { TAboutNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { aboutNodeBundleMetadataMap, TAboutNodeBundleMetadata, TBundleType } from '../environment';

export function createAboutNodeEditorContext<GNode extends TAboutNode>(
	config: TCreateAboutNodeEditorContextConfig<GNode>
): TAboutNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TBundleType>(node._v.bundleType),
		isSwitchingBundle: createState(false),

		async switchBundleType(this: TAboutNodeEditorContext<GNode>, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = aboutNodeBundleMetadataMap[
				this.node._v.bundleType
			] as TAboutNodeBundleMetadata<GNode>;
			const nextMetadata = aboutNodeBundleMetadataMap[
				bundleType
			] as TAboutNodeBundleMetadata<GNode>;

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

export interface TCreateAboutNodeEditorContextConfig<GNode extends TAboutNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TAboutNodeEditorContext<GNode extends TAboutNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TBundleType, []>;
	isSwitchingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TBundleType) => Promise<TResult<void, AppError>>;
}

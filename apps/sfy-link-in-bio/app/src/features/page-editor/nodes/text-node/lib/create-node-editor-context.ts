import { TTextNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { textNodeBundleMetadataMap, TTextNodeBundleMetadata } from '../environment';

export function createTextNodeEditorContext<GNode extends TTextNode>(
	config: TCreateTextNodeEditorContextConfig<GNode>
): TTextNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TTextNode['bundleType']>(node._v.bundleType),
		isSwitchingBundle: createState(false),

		async switchBundleType(this: TTextNodeEditorContext<GNode>, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = textNodeBundleMetadataMap[
				this.node._v.bundleType
			] as unknown as TTextNodeBundleMetadata<GNode>;
			const nextMetadata = textNodeBundleMetadataMap[
				bundleType
			] as unknown as TTextNodeBundleMetadata<GNode>;

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

export interface TCreateTextNodeEditorContextConfig<GNode extends TTextNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TTextNodeEditorContext<GNode extends TTextNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TTextNode['bundleType'], []>;
	isSwitchingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TTextNode['bundleType']) => Promise<TResult<void, AppError>>;
}

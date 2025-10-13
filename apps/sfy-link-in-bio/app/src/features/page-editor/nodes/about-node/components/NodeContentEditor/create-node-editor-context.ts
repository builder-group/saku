import { TAboutNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../lib';
import { bundleMetadata, bundleMetadataMap, TBundleMetadata, TBundleType } from './bundle-metadata';

export function createNodeEditorContext<GNode extends TAboutNode>(
	config: TCreateNodeEditorContextConfig<GNode>
): TNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TBundleType>(node._v.bundleType),
		applicableBundleTypes: createState(
			bundleMetadata.filter((variant) => variant.isApplicable()).map((variant) => variant.type)
		),
		isSwitchingBundle: createState(false),
		isEnhancingBundle: createState(false),

		async switchBundleType(this: TNodeEditorContext<GNode>, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = bundleMetadataMap[this.node._v.bundleType] as TBundleMetadata<GNode>;
			const nextMetadata = bundleMetadataMap[bundleType] as TBundleMetadata<GNode>;

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

			// Enhance node bundle
			const enhanceResult = await this.enhanceBundle(bundleType);
			if (enhanceResult.isErr()) {
				return enhanceResult;
			}

			return Ok(undefined);
		},

		async enhanceBundle(this: TNodeEditorContext<GNode>, bundleType = this.selectedBundleType._v) {
			const metadata = bundleMetadataMap[bundleType] as TBundleMetadata<GNode>;
			if (typeof metadata?.enhance !== 'function') {
				return Ok(undefined);
			}

			this.isEnhancingBundle.set(true);
			const result = await metadata.enhance({
				node: this.node,
				editor
			});
			this.isEnhancingBundle.set(false);

			return result;
		}
	};
}

export interface TCreateNodeEditorContextConfig<GNode extends TAboutNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TNodeEditorContext<GNode extends TAboutNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TBundleType, []>;
	applicableBundleTypes: TState<TBundleType[], []>;
	isSwitchingBundle: TState<boolean, []>;
	isEnhancingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TBundleType) => Promise<TResult<void, AppError>>;
	enhanceBundle: (bundleType?: TBundleType) => Promise<TResult<void, AppError>>;
}

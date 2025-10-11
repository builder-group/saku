import { parseUrl, TLinkNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { bundleMetadataMap, bundlePriority, TBundleMetadata, TBundleType } from '../environment';
import { getApplicableBundle } from './get-applicable-bundle';

export function createNodeEditorContext<GNode extends TLinkNode>(
	config: TCreateNodeEditorContextConfig<GNode>
): TNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TBundleType>(node._v.content.type),
		applicableBundleTypes: createState(getApplicableBundle(node._v.content.url)),
		isSwitchingBundle: createState(false),
		isEnhancingBundle: createState(false),

		async switchBundleType(this: TNodeEditorContext<GNode>, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = bundleMetadataMap[this.node._v.content.type] as TBundleMetadata<GNode>;
			const nextMetadata = bundleMetadataMap[bundleType] as TBundleMetadata<GNode>;

			try {
				// Update node bundle
				const updateResult = await nextMetadata.update({
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

		async updateUrlAndEnhance(this: TNodeEditorContext<GNode>, newUrl) {
			if (newUrl === this.node._v.content.url) {
				return Ok(undefined);
			}

			const bundleType = this.selectedBundleType._v;

			// Normalize url
			let normalizedUrl = newUrl.trim();
			if (normalizedUrl.length > 0 && !normalizedUrl.match(/^https?:\/\//)) {
				normalizedUrl = `https://${normalizedUrl}`;
			}

			// Check if this is a major URL change
			const current = parseUrl(this.node._v.content.url);
			const updated = parseUrl(newUrl);
			const isMajorChange = current?.hostname !== updated?.hostname;

			// Update url in node
			this.node._v.content.url = normalizedUrl;
			this.node._notify({ listenerContext: { source: 'apply-url-and-enhance' } });

			// Only switch bundles on major changes
			if (isMajorChange) {
				// Get applicable bundles for the new URL
				const applicableBundles = getApplicableBundle(normalizedUrl);
				this.applicableBundleTypes.set(applicableBundles);

				// Auto-switch to best applicable bundle (prioritize more specific types)
				const bestVariant = this.getBestBundleType(applicableBundles);
				if (bestVariant !== bundleType) {
					return await this.switchBundleType(bestVariant);
				}
			}

			// Enhance bundle
			const enhanceResult = await this.enhanceBundle(bundleType);
			if (enhanceResult.isErr()) {
				return enhanceResult;
			}

			return Ok(undefined);
		},

		getBestBundleType(this: TNodeEditorContext<GNode>, applicableTypes) {
			for (const type of bundlePriority) {
				if (applicableTypes.includes(type)) {
					return type;
				}
			}

			return applicableTypes[0] as TBundleType;
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

export interface TCreateNodeEditorContextConfig<GNode extends TLinkNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TNodeEditorContext<GNode extends TLinkNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TBundleType, []>;
	applicableBundleTypes: TState<TBundleType[], []>;
	isSwitchingBundle: TState<boolean, []>;
	isEnhancingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TBundleType) => Promise<TResult<void, AppError>>;
	updateUrlAndEnhance: (newUrl: string) => Promise<TResult<void, AppError>>;
	getBestBundleType: (applicableTypes: TBundleType[]) => TBundleType;
	enhanceBundle: (bundleType?: TBundleType) => Promise<TResult<void, AppError>>;
}

import { parseUrl, TLinkNode } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import {
	linkNodeBundleMetadata,
	linkNodeBundleMetadataMap,
	linkNodeBundlePriority,
	TLinkNodeBundleMetadata
} from '../environment';

export function createLinkNodeEditorContext<GNode extends TLinkNode = TLinkNode>(
	config: TCreateLinkNodeEditorContextConfig<GNode>
): TLinkNodeEditorContext<GNode> {
	const { node, editor } = config;

	return {
		node,
		editor,
		shopify: editor.shopify,
		selectedBundleType: createState<TLinkNode['bundleType']>(node._v.bundleType),
		applicableBundleTypes: createState(
			linkNodeBundleMetadata
				.filter((variant) => variant.isApplicable(node._v.content.url))
				.map((variant) => variant.type)
		),
		isSwitchingBundle: createState(false),
		isEnhancingBundle: createState(false),

		async switchBundleType(this: TLinkNodeEditorContext, bundleType) {
			this.isSwitchingBundle.set(true);
			this.selectedBundleType.set(bundleType);

			const metadata = linkNodeBundleMetadataMap[
				this.node._v.bundleType
			] as TLinkNodeBundleMetadata;
			const nextMetadata = linkNodeBundleMetadataMap[bundleType] as TLinkNodeBundleMetadata;

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

		async enhanceBundle(this: TLinkNodeEditorContext, bundleType = this.selectedBundleType._v) {
			const metadata = linkNodeBundleMetadataMap[bundleType] as TLinkNodeBundleMetadata;
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
		},

		async updateUrlAndEnhance(this: TLinkNodeEditorContext, newUrl) {
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
				const applicableBundleTypes = linkNodeBundleMetadata
					.filter((variant) => variant.isApplicable(normalizedUrl))
					.map((variant) => variant.type);
				this.applicableBundleTypes.set(applicableBundleTypes);

				// Auto-switch to best applicable bundle (prioritize more specific types)
				const bestVariant =
					linkNodeBundlePriority.find((type) => applicableBundleTypes.includes(type)) ??
					applicableBundleTypes[0];
				if (bestVariant != null && bestVariant !== bundleType) {
					return await this.switchBundleType(bestVariant);
				}
			}

			// Enhance bundle
			const enhanceResult = await this.enhanceBundle(bundleType);
			if (enhanceResult.isErr()) {
				return enhanceResult;
			}

			return Ok(undefined);
		}
	};
}

export interface TCreateLinkNodeEditorContextConfig<GNode extends TLinkNode = TLinkNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TLinkNodeEditorContext<GNode extends TLinkNode = TLinkNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedBundleType: TState<TLinkNode['bundleType'], []>;
	applicableBundleTypes: TState<TLinkNode['bundleType'][], []>;
	isSwitchingBundle: TState<boolean, []>;
	isEnhancingBundle: TState<boolean, []>;
	switchBundleType: (bundleType: TLinkNode['bundleType']) => Promise<TResult<void, AppError>>;
	enhanceBundle: (bundleType?: TLinkNode['bundleType']) => Promise<TResult<void, AppError>>;
	updateUrlAndEnhance: (newUrl: string) => Promise<TResult<void, AppError>>;
}

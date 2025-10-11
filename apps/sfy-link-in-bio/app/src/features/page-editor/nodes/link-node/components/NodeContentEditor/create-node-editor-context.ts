import { parseUrl, TLinkNode } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../lib';
import {
	contentMetadataMap,
	contentTypePriority,
	TContentMetadata,
	TContentType
} from './environment';
import { getApplicableContent } from './lib';

export function createNodeEditorContext<GNode extends TLinkNode>(
	config: TCreateNodeEditorContextConfig<GNode>
): TNodeEditorContext<GNode> {
	const { node, editor, shopify } = config;

	return {
		node,
		editor,
		shopify,
		selectedContentType: createState<TContentType>(node._v.content.type),
		applicableContentTypes: createState(getApplicableContent(node._v.content.url)),
		isChangingContentType: createState(false),
		isEnhancing: createState(false),

		async updateContentType(this: TNodeEditorContext<GNode>, contentType) {
			this.isChangingContentType.set(true);
			this.selectedContentType.set(contentType);

			const metadata = contentMetadataMap[this.node._v.content.type] as TContentMetadata<GNode>;
			const targetMetadata = contentMetadataMap[contentType] as TContentMetadata<GNode>;

			try {
				// Create content
				const contentResult = await targetMetadata.createContent({
					url: this.node._v.content.url,
					common: metadata.extractCommonFields(this.node._v),
					editor,
					shopify,
					node: this.node
				});
				if (contentResult.isErr()) {
					return Err(new AppError('#ERR_FAILED_TO_CREATE_VARIANT'));
				}
			} finally {
				this.isChangingContentType.set(false);
			}

			// Enhance content
			const enhanceResult = await this.enhanceContent(contentType);
			if (enhanceResult.isErr()) {
				return enhanceResult;
			}

			return Ok(undefined);
		},

		async updateUrlAndEnhance(this: TNodeEditorContext<GNode>, newUrl: string) {
			if (newUrl === this.node._v.content.url) {
				return Ok(undefined);
			}

			const contentType = this.selectedContentType._v;

			// Ensure URL has proper protocol prefix
			let normalizedUrl = newUrl.trim();
			if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//)) {
				normalizedUrl = `https://${normalizedUrl}`;
			}

			// Check if this is a major URL change
			const current = parseUrl(this.node._v.content.url);
			const updated = parseUrl(newUrl);
			const isMajorChange = current?.hostname !== updated?.hostname;

			// Update the actual URL
			this.node._v.content.url = normalizedUrl;
			this.node._notify({ listenerContext: { source: 'apply-url-and-enhance' } });

			// Only switch variants on major changes
			if (isMajorChange) {
				// Get applicable content variants for the new URL
				const applicableContentVariants = getApplicableContent(normalizedUrl);
				this.applicableContentTypes.set(applicableContentVariants);

				// Auto-switch to best applicable variant (prioritize more specific types)
				const bestVariant = this.getBestContentType(applicableContentVariants);
				if (bestVariant !== contentType) {
					return await this.updateContentType(bestVariant);
				}
			}

			// Enhance content
			const enhanceResult = await this.enhanceContent(contentType);
			if (enhanceResult.isErr()) {
				return enhanceResult;
			}

			return Ok(undefined);
		},

		getBestContentType(this: TNodeEditorContext<GNode>, applicableTypes) {
			for (const type of contentTypePriority) {
				if (applicableTypes.includes(type)) {
					return type;
				}
			}

			return applicableTypes[0] as TContentType;
		},

		async enhanceContent(
			this: TNodeEditorContext<GNode>,
			contentType = this.selectedContentType._v
		) {
			const metadata = contentMetadataMap[contentType] as TContentMetadata<GNode>;
			if (metadata?.enhanceContent == null) {
				return Ok(undefined);
			}

			this.isEnhancing.set(true);
			const result = await metadata.enhanceContent({
				url: this.node._v.content.url,
				editor,
				shopify,
				node: this.node
			});
			this.isEnhancing.set(false);

			return result;
		}
	};
}

export interface TCreateNodeEditorContextConfig<GNode extends TLinkNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
}

export interface TNodeEditorContext<GNode extends TLinkNode> {
	node: TNodeState<GNode>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedContentType: TState<TContentType, []>;
	applicableContentTypes: TState<TContentType[], []>;
	isChangingContentType: TState<boolean, []>;
	isEnhancing: TState<boolean, []>;
	updateContentType: (contentType: TContentType) => Promise<TResult<void, AppError>>;
	updateUrlAndEnhance: (newUrl: string) => Promise<TResult<void, AppError>>;
	getBestContentType: (applicableTypes: TContentType[]) => TContentType;
	enhanceContent: (contentType?: TContentType) => Promise<TResult<void, AppError>>;
}

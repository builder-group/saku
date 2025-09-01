import { TLinkNode, TLinkNodeContent } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../../lib';
import { contentMetadataMap, TContentType } from './environment';
import { getApplicableContent } from './lib';

export function createNodeEditorContext<GContent extends TLinkNodeContent>(
	config: TCreateNodeEditorContextConfig<GContent>
): TNodeEditorContext<GContent> {
	const { node, editor, shopify } = config;

	return {
		node,
		editor,
		shopify,
		selectedContentType: createState<TContentType>('single'),
		isChangingContentType: createState(false),
		isEnhancing: createState(false),

		updateUrl(this: TNodeEditorContext<GContent>, value) {
			// Ensure URL has proper protocol prefix
			let normalizedUrl = value.trim();
			if (normalizedUrl != null && !normalizedUrl.match(/^https?:\/\//)) {
				normalizedUrl = `https://${normalizedUrl}`;
			}

			this.node._v.content.url = normalizedUrl;
			this.node._notify({ listenerContext: { source: 'url-change' } });
		},

		async updateContentType(this: TNodeEditorContext<GContent>, contentType) {
			this.isChangingContentType.set(true);
			this.selectedContentType.set(contentType);

			try {
				const targetMetadata = contentMetadataMap[contentType];
				if (targetMetadata == null) {
					return Err(new AppError('#ERR_UNKNOWN_VARIANT_TYPE'));
				}

				const content = this.node._v.content;

				// Extract common fields from current variant
				const commonFields = contentMetadataMap[content.type].extractCommonFields(content as any);

				// Create content
				const contentResult = await targetMetadata.createContent({
					url: content.url,
					common: commonFields,
					editor,
					shopify,
					node: this.node as any
				});
				if (contentResult.isErr()) {
					return Err(new AppError('#ERR_FAILED_TO_CREATE_VARIANT'));
				}

				// Enhance content
				const enhanceResult = await this.enhanceContent(contentType);
				if (enhanceResult.isErr()) {
					return enhanceResult;
				}
			} finally {
				this.isChangingContentType.set(false);
			}

			return Ok(undefined);
		},

		async validateAndEnhanceContent(this: TNodeEditorContext<GContent>) {
			const contentType = this.selectedContentType._v;
			const content = this.node._v.content;

			// Check if current content variant is still valid for the new URL
			const applicableContentVariants = getApplicableContent(content.url);
			const isContentApplicable = applicableContentVariants.some(
				(variant) => variant.value === contentType
			);
			if (!isContentApplicable) {
				return await this.updateContentType('single');
			}

			// Enhance content
			const enhanceResult = await this.enhanceContent(contentType);
			if (enhanceResult.isErr()) {
				return enhanceResult;
			}

			return Ok(undefined);
		},

		async enhanceContent(
			this: TNodeEditorContext<GContent>,
			contentType = this.selectedContentType._v
		) {
			const metadata = contentMetadataMap[contentType];
			if (metadata?.enhanceContent == null) {
				return Ok(undefined);
			}

			this.isEnhancing.set(true);
			const result = await metadata.enhanceContent({
				url: this.node._v.content.url,
				editor,
				shopify,
				node: this.node as any
			});
			this.isEnhancing.set(false);

			return result;
		}
	};
}

export interface TCreateNodeEditorContextConfig<GContent extends TLinkNodeContent> {
	node: TNodeState<TLinkNode<GContent>>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
}

export interface TNodeEditorContext<GContent extends TLinkNodeContent> {
	node: TNodeState<TLinkNode<GContent>>;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
	selectedContentType: TState<TContentType, []>;
	isChangingContentType: TState<boolean, []>;
	isEnhancing: TState<boolean, []>;

	updateUrl: (value: string) => void;
	updateContentType: (contentType: TContentType) => Promise<TResult<void, AppError>>;
	validateAndEnhanceContent: () => Promise<TResult<void, AppError>>;
	enhanceContent: (contentType?: TContentType) => Promise<TResult<void, AppError>>;
}

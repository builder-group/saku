import {
	TLinkNode,
	TSingleLinkNodeContent,
	TSpotifyEmbedLinkNodeContent,
	TYouTubeEmbedLinkNodeContent
} from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Select, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, JsonPreview, PortalPulse } from '@/components';
import { TNodeEditorComponentProps } from '../../../../lib';
import { ContentSkeleton } from './ContentSkeleton';
import { createNodeEditorContext, TNodeEditorContext } from './create-node-editor-context';
import { contentMetadataMap, TContentType } from './environment';
import { SingleContent } from './SingleContent';
import { SpotifyEmbedContent } from './SpotifyEmbedContent';
import { YoutubeEmbedContent } from './YoutubeEmbedContent';

export const LinkNodeContentEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const shopify = useAppBridge();

	const cx = React.useMemo(
		() => createNodeEditorContext({ node: nodeState, editor, shopify }),
		[nodeState, editor, shopify]
	);

	const contentVariant = useCompute(cx.node, ({ value }) => value.content.type);
	const applicableContentOptions = useCompute(cx.applicableContentTypes, ({ value }) =>
		value.map((type) => ({
			label: contentMetadataMap[type].label,
			value: type
		}))
	);
	const isChangingContentType = useFeatureState(cx.isChangingContentType);
	const isEnhancingVariant = useFeatureState(cx.isEnhancing);
	const selectedContentType = useFeatureState(cx.selectedContentType);

	// =========================================================================
	// Events
	// =========================================================================

	const handleContentTypeChange = React.useCallback(
		(value: TContentType) => {
			cx.updateContentType(value).then((result) => {
				if (result.isErr()) {
					shopify.toast.show('Failed to update variant type', { duration: 3000 });
				}
			});
		},
		[cx, shopify]
	);

	// =========================================================================
	// UI
	// =========================================================================

	const renderVariantEditor = React.useCallback((): React.ReactElement | null => {
		switch (contentVariant) {
			case 'single':
				return (
					<SingleContent cx={cx as TNodeEditorContext<TSingleLinkNodeContent>} className="z-10" />
				);
			case 'youtube-embed':
				return (
					<YoutubeEmbedContent
						cx={cx as TNodeEditorContext<TYouTubeEmbedLinkNodeContent>}
						className="z-10"
					/>
				);
			case 'spotify-embed':
				return (
					<SpotifyEmbedContent
						cx={cx as TNodeEditorContext<TSpotifyEmbedLinkNodeContent>}
						className="z-10"
					/>
				);
			default:
				return null;
		}
	}, [contentVariant, cx]);

	return (
		<>
			<div className="space-y-1 border-b border-neutral-200 px-4 py-3">
				<Text as="span" variant="bodySm" tone="subdued">
					Content Type
				</Text>
				<Select
					id="link-content-type-field"
					label="Link content type"
					labelHidden
					options={applicableContentOptions}
					value={selectedContentType}
					onChange={handleContentTypeChange}
					disabled={isChangingContentType || isEnhancingVariant}
				/>
			</div>

			<div className="relative border-b border-neutral-200">
				{isChangingContentType ? (
					<ContentSkeleton className="z-10" />
				) : (
					<>
						<PortalPulse isActive={cx.isEnhancing} className="top-0 left-0" />
						{renderVariantEditor()}
					</>
				)}
			</div>

			{/* Debug Section */}
			{editor.isDebug() && (
				<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
					<div className="space-y-1 px-4">
						<Text as="span" variant="bodySm" tone="subdued">
							JSON
						</Text>
						<JsonPreview data={nodeState._v} />
					</div>
				</AccordionSection>
			)}
		</>
	);
};

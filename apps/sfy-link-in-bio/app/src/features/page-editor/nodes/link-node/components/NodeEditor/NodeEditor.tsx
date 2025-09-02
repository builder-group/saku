import { TLinkNode, TSingleLinkNodeContent, TYouTubeVideoEmbedLinkNodeContent } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Select, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, PortalPulse } from '@/components';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../../mixins';
import { ContentSkeleton } from './ContentSkeleton';
import { createNodeEditorContext, TNodeEditorContext } from './create-node-editor-context';
import { contentMetadataMap, TContentType } from './environment';
import { SingleContent } from './SingleContent';
import { YoutubeVideoEmbedContent } from './YoutubeVideoEmbedContent';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
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
			case 'youtube-video-embed':
				return (
					<YoutubeVideoEmbedContent
						cx={cx as TNodeEditorContext<TYouTubeVideoEmbedLinkNodeContent>}
						className="z-10"
					/>
				);
			default:
				return null;
		}
	}, [contentVariant, cx]);

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<div className="space-y-1 px-4">
					<Text as="span" variant="bodySm" tone="subdued">
						Content Type
					</Text>
					<Select
						id="link-display-field"
						label="Link display"
						labelHidden
						options={applicableContentOptions}
						value={selectedContentType}
						onChange={handleContentTypeChange}
						disabled={isChangingContentType || isEnhancingVariant}
					/>
				</div>

				<div className="h-px bg-neutral-200" />
				{isChangingContentType ? (
					<ContentSkeleton className="z-10" />
				) : (
					<div className="relative">
						<PortalPulse isActive={cx.isEnhancing} className="-top-3 right-0 -bottom-3 left-0" />
						{renderVariantEditor()}
					</div>
				)}
			</AccordionSection>

			{/* Design Section */}
			<AccordionSection title="Design" collapsibleClassName="p-0 border-b-0">
				<AccordionSection
					title="Layer"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<AutoLayoutStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.autoLayout}
						tokenSet={editor.mixinTokenMap.autoLayout}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.appearance}
						tokenSet={editor.mixinTokenMap.appearance}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<FillStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.fill}
						applyValue={(state, value) => {
							state._v.fill = value;
						}}
						tokenSet={editor.mixinTokenMap.fill}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<StrokeStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.stroke}
						applyValue={(state, value) => {
							state._v.stroke = value;
						}}
						tokenSet={editor.mixinTokenMap.stroke}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<ShadowStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.shadow}
						applyValue={(state, value) => {
							state._v.shadow = value;
						}}
						tokenSet={editor.mixinTokenMap.shadow}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
				<AccordionSection
					title="Text"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<TextStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.text}
						tokenSet={editor.mixinTokenMap.text}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
			</AccordionSection>
		</>
	);
};

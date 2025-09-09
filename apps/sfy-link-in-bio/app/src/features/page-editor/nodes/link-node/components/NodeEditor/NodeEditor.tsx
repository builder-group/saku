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
import { AccordionSection, PortalPulse } from '@/components';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../../mixins';
import { ContentSkeleton } from './ContentSkeleton';
import { createNodeEditorContext, TNodeEditorContext } from './create-node-editor-context';
import { contentMetadataMap, TContentType } from './environment';
import { SingleContent } from './SingleContent';
import { SpotifyEmbedContent } from './SpotifyEmbedContent';
import { YoutubeEmbedContent } from './YoutubeEmbedContent';

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

	const hasTextStyle = useCompute(cx.node, ({ value }) => value.content.type === 'single');
	const hasSmTextStyle = useCompute(cx.node, ({ value }) => value.content.type === 'single');
	const hasImageStyle = useCompute(
		cx.node,
		({ value }) =>
			value.content.type === 'single' &&
			(value.content.favicon != null || value.content.userFavicon != null)
	);

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
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.appearance}
						tokenSet={editor.mixinTokenMap.appearance}
						tokenRefKey={'default'}
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
						tokenRefKey={'default'}
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
						tokenRefKey={'default'}
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
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>

				{hasTextStyle && (
					<AccordionSection
						title="Title Text"
						collapsibleClassName="px-0 space-y-3"
						size="tight"
						defaultOpen={true}
					>
						<TextStyleMixinEditor
							state={nodeState}
							mapValue={(value) => value.text}
							tokenSet={editor.mixinTokenMap.text}
							tokenRefKey={'default'}
							mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
							editor={editor}
						/>
					</AccordionSection>
				)}
				{hasSmTextStyle && (
					<AccordionSection
						title="Description Text"
						collapsibleClassName="px-0 space-y-3"
						size="tight"
						defaultOpen={true}
					>
						<TextStyleMixinEditor
							state={nodeState}
							mapValue={(value) => value.textSm}
							tokenSet={editor.mixinTokenMap.text}
							tokenRefKey={'sm'}
							mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
							editor={editor}
						/>
					</AccordionSection>
				)}
				{hasImageStyle && (
					<AccordionSection
						title="Favicon Image"
						collapsibleClassName="px-0 space-y-3"
						size="tight"
						defaultOpen={true}
					>
						<ImageStyleMixinEditor
							state={nodeState}
							mapValue={(value) => value.image}
							tokenSet={editor.mixinTokenMap.image}
							tokenRefKey={'default'}
							mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
							editor={editor}
						/>
					</AccordionSection>
				)}
			</AccordionSection>
		</>
	);
};

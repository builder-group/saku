import {
	TLinkNode,
	tokenRef,
	TSingleLinkNodeContent,
	TSpotifyEmbedLinkNodeContent,
	TYouTubeEmbedLinkNodeContent
} from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Select, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, JsonPreview, PortalPulse } from '@/components';
import { useNodeProperty } from '../../../../hooks';
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

	const hasTextStyle = useCompute(cx.node, ({ value }) => {
		switch (value.content.type) {
			case 'single':
				return true;
			default:
				return false;
		}
	});
	const hasSmTextStyle = useCompute(cx.node, ({ value }) => {
		switch (value.content.type) {
			case 'single':
				return true;
			default:
				return false;
		}
	});
	const imageStyle = useCompute(cx.node, ({ value }) => {
		switch (value.content.type) {
			case 'single':
				return {
					enabled: value.content.favicon != null || value.content.userFavicon != null,
					title: 'Favicon Image'
				};
			case 'youtube-embed':
				return {
					enabled: true,
					title: 'Embed'
				};
			case 'spotify-embed':
				return {
					enabled: true,
					title: 'Embed'
				};
			default:
				return {
					enabled: false,
					title: ''
				};
		}
	});

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');
	const strokeState = useNodeProperty(nodeState, 'stroke');
	const shadowState = useNodeProperty(nodeState, 'shadow');
	const textState = useNodeProperty(nodeState, 'text');
	const textSmState = useNodeProperty(nodeState, 'textSm');
	const imageState = useNodeProperty(nodeState, 'image');

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
						state={autoLayoutState}
						onLinkToken={() => tokenRef('default', 'auto-layout')}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={appearanceState}
						onLinkToken={() => tokenRef('default', 'appearance')}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<FillStyleMixinEditor
						state={fillState}
						onLinkToken={() => tokenRef('default', 'fill')}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<StrokeStyleMixinEditor
						state={strokeState}
						onLinkToken={() => tokenRef('default', 'stroke')}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<ShadowStyleMixinEditor
						state={shadowState}
						onLinkToken={() => tokenRef('default', 'shadow')}
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
							state={textState}
							onLinkToken={() => tokenRef('default', 'text')}
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
							state={textSmState}
							onLinkToken={() => tokenRef('sm', 'text')}
							editor={editor}
						/>
					</AccordionSection>
				)}
				{imageStyle.enabled && (
					<AccordionSection
						title={imageStyle.title}
						collapsibleClassName="px-0 space-y-3"
						size="tight"
						defaultOpen={true}
					>
						<ImageStyleMixinEditor
							state={imageState}
							onLinkToken={() => tokenRef('default', 'image')}
							editor={editor}
						/>
					</AccordionSection>
				)}
			</AccordionSection>

			{/* Debug Section */}
			{editor.isPartnerDevelopment() && (
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

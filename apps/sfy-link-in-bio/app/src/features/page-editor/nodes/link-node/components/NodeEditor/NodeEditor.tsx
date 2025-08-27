import { TDefaultLinkVariant, TLinkNode, TYouTubeVideoEmbedVariant } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { PortalPulse } from '@/components/display';
import { TNodeEditorComponentProps, TNodeState } from '../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../../mixins';
import { DefaultLinkVariant } from './DefaultLinkVariant';
import { linkVariantMetadataMap, TVariantType } from './environment';
import { getApplicableVariants } from './lib';
import { YoutubeVideoEmbedVariant } from './YoutubeVideoEmbedVariant';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);
	const shopify = useAppBridge();

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const [selectedVariantType, setSelectedVariantType] = React.useState<TVariantType>(() => {
		return content.variant.type;
	});
	const [isChangingVariant, setIsChangingVariant] = React.useState(false);
	const [isEnhancingVariant, setIsEnhancingVariant] = React.useState(false);

	const availableVariants = React.useMemo(() => getApplicableVariants(content.url), [content.url]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleVariantTypeChange = React.useCallback(
		async (value: TVariantType) => {
			setSelectedVariantType(value as TVariantType);

			try {
				const targetMetadata = linkVariantMetadataMap[value];
				if (targetMetadata == null) {
					shopify.toast.show('Unknown variant type', { duration: 3000 });
					return;
				}

				// Extract common fields from current variant
				const commonFields = linkVariantMetadataMap[content.variant.type].extractCommonFields(
					content.variant as any
				);

				const variantResult = await targetMetadata.createVariant({
					url: content.url,
					common: commonFields,
					editor,
					shopify,
					nodeState: nodeState as any
				});
				if (variantResult.isErr()) {
					shopify.toast.show('Failed to create variant', {
						duration: 3000,
						action: 'Retry',
						onAction: () => handleVariantTypeChange(value)
					});
					return;
				}

				// Start background enhancement if available
				if ('enhanceVariant' in targetMetadata && targetMetadata.enhanceVariant != null) {
					setIsEnhancingVariant(true);

					targetMetadata
						.enhanceVariant({
							url: content.url,
							editor,
							shopify,
							nodeState: nodeState as any
						})
						.then((enhanceResult) => {
							if (enhanceResult.isErr()) {
								shopify.toast.show('Failed to enhance variant data', { duration: 3000 });
							}
						})
						.finally(() => {
							setIsEnhancingVariant(false);
						});
				}
			} finally {
				setIsChangingVariant(false);
			}
		},
		[content.url, content.variant, editor, nodeState, shopify]
	);

	const handleUrlChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.url = value;
			nodeState._notify({ listenerContext: { source: 'url-change' } });
		},
		[nodeState]
	);

	const handleUrlBlur = React.useCallback(async () => {
		const currentVariantType = content.variant.type;
		const metadata = linkVariantMetadataMap[currentVariantType];

		// Check if current variant is still valid for the new URL
		const availableVariants = getApplicableVariants(content.url);
		const isCurrentVariantValid = availableVariants.some(
			(variant) => variant.value === currentVariantType
		);

		// If current variant is no longer valid, switch to default
		if (!isCurrentVariantValid && currentVariantType !== 'default') {
			handleVariantTypeChange('default');
			return;
		}

		if (metadata?.enhanceVariant == null) {
			return;
		}

		setIsEnhancingVariant(true);
		metadata
			.enhanceVariant({
				url: content.url,
				editor,
				shopify,
				nodeState: nodeState as any
			})
			.then((enhanceResult) => {
				if (enhanceResult.isErr()) {
					shopify.toast.show('Failed to enhance variant data', { duration: 3000 });
				}
			})
			.finally(() => {
				setIsEnhancingVariant(false);
			});
	}, [content.url, content.variant.type, editor, nodeState, shopify, handleVariantTypeChange]);

	// =========================================================================
	// UI
	// =========================================================================

	const renderVariantEditor = React.useCallback((): React.ReactElement | null => {
		switch (content.variant.type) {
			case 'default':
				return (
					<DefaultLinkVariant
						nodeState={nodeState as TNodeState<TLinkNode<TDefaultLinkVariant>>}
						editor={editor}
						isEnhancing={isEnhancingVariant}
					/>
				);
			case 'youtube-video-embed':
				return (
					<YoutubeVideoEmbedVariant
						nodeState={nodeState as TNodeState<TLinkNode<TYouTubeVideoEmbedVariant>>}
						editor={editor}
						isEnhancing={isEnhancingVariant}
					/>
				);
			default:
				return null;
		}
	}, [content.variant.type, editor, nodeState, isEnhancingVariant]);

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<div className="space-y-3 px-4">
					{/* URL */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							URL
						</Text>
						<TextField
							id="url-field"
							label="URL"
							labelHidden
							value={content.url}
							onChange={handleUrlChange}
							onBlur={handleUrlBlur}
							autoComplete="off"
							placeholder="https://example.com"
							type="url"
							disabled={isChangingVariant}
						/>
					</div>

					{/* Link variant */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Variant {isEnhancingVariant && '(enhancing...)'}
						</Text>
						<Select
							id="link-display-field"
							label="Link display"
							labelHidden
							options={availableVariants}
							value={selectedVariantType}
							onChange={handleVariantTypeChange}
							disabled={availableVariants.length === 1 || isChangingVariant || isEnhancingVariant}
						/>
					</div>
				</div>

				{!isChangingVariant && (
					<>
						<div className="h-px bg-neutral-200" />
						{isEnhancingVariant ? (
							<PortalPulse
								isActive={true}
								className="relative"
								pulseClassName="absolute -top-3 -bottom-4 left-0 right-0"
							>
								{renderVariantEditor()}
							</PortalPulse>
						) : (
							renderVariantEditor()
						)}
					</>
				)}
			</AccordionSection>

			{/* Design Section */}
			<AccordionSection title="Design" collapsibleClassName="p-0 border-b-0">
				<AccordionSection
					title="Card"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<AutoLayoutStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.autoLayout}
						tokenSet={editor.tokensMap.autoLayout}
						mapToken={(token) => token}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.appearance}
						tokenSet={editor.tokensMap.appearance}
						mapToken={(token) => token}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<FillStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
					<div className="h-px bg-neutral-200" />
					<StrokeStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
					<div className="h-px bg-neutral-200" />
					<ShadowStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
				</AccordionSection>
				<AccordionSection
					title="Text"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<TextStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
				</AccordionSection>
			</AccordionSection>
		</>
	);
};

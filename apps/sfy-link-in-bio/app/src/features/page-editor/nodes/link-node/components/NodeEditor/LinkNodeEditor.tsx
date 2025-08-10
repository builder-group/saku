import {
	fontMetadata,
	inheritStyle,
	isInheritedStyle,
	resolveStyleReference,
	TLinkNode
} from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { PortalPulse } from '@/components/display';
import {
	ColorStyleField,
	SelectStyleField,
	TextStyleField,
	ToggleStyleField
} from '../../../../components';
import { TNodeEditorComponentProps } from '../../../../lib';
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
	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

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
		if (metadata?.enhanceVariant == null) {
			return;
		}

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
	}, [content.url, content.variant.type, editor, nodeState, shopify]);

	// =========================================================================
	// UI
	// =========================================================================

	const renderVariantEditor = React.useCallback((): React.ReactElement | null => {
		switch (content.variant.type) {
			case 'default':
				return (
					<DefaultLinkVariant
						nodeState={nodeState}
						editor={editor}
						isEnhancing={isEnhancingVariant}
					/>
				);
			case 'youtube-video':
				return (
					<div className="space-y-4 px-4">
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								YouTube Video
							</Text>
							<Text as="p" variant="bodyMd" tone="subdued">
								Video card editor coming soon...
							</Text>
						</div>
					</div>
				);
			case 'youtube-channel':
				return (
					<div className="space-y-4 px-4">
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								YouTube Channel
							</Text>
							<Text as="p" variant="bodyMd" tone="subdued">
								Channel card editor coming soon...
							</Text>
						</div>
					</div>
				);
			case 'youtube-video-embed':
				return (
					<YoutubeVideoEmbedVariant
						nodeState={nodeState}
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
						<div className="h-px bg-gray-200" />
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

			{/* Style Section*/}
			<AccordionSection title="Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				{/* Layout */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Layout
						</Text>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<TextStyleField
							label="Padding"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.padding}
							nodeValueSetter={(node, value) => {
								node._v.style.padding = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.padding}
							type="number"
							autoComplete="off"
							min={0}
							max={100}
						/>

						<TextStyleField
							label="Border Radius"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.borderRadius}
							nodeValueSetter={(node, value) => {
								node._v.style.borderRadius = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.borderRadius}
							type="number"
							autoComplete="off"
							min={0}
							max={999}
						/>
					</div>
				</div>

				<div className="h-px bg-gray-200" />

				{/* Typography */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Typography
						</Text>
					</div>
					<div className="space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<SelectStyleField
								label="Font Family"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) =>
									isInheritedStyle(value.style.font)
										? { type: 'inherit' }
										: resolveStyleReference(value.style.font)?.family
								}
								nodeValueSetter={(node, value) => {
									if (isInheritedStyle(value)) {
										node._v.style.font = inheritStyle();
										node._notify();
									} else if (value != null) {
										const font = editor.registerFontFamily(value);
										if (font != null) {
											node._v.style.font = font;
											node._notify();
										}
									}
								}}
								parentValueMapper={(parent) => parent.style.children.font.family}
								options={fontOptions}
							/>

							<SelectStyleField
								label="Text Align"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) => value.style.textAlign}
								nodeValueSetter={(node, value) => {
									node._v.style.textAlign = value;
									node._notify();
								}}
								parentValueMapper={(parent) => parent.style.children?.textAlign}
								options={[
									{ label: 'Left', value: 'left' },
									{ label: 'Center', value: 'center' },
									{ label: 'Right', value: 'right' }
								]}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<TextStyleField
								label="Font Size"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) => value.style.fontSize}
								nodeValueSetter={(node, value) => {
									node._v.style.fontSize = value;
									node._notify();
								}}
								parentValueMapper={(parent) => parent.style.children?.fontSize}
								type="number"
								autoComplete="off"
								min={0}
								max={96}
							/>

							<ColorStyleField
								label="Text Color"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) => value.style.textColor}
								nodeValueSetter={(node, value) => {
									node._v.style.textColor = value;
									node._notify();
								}}
								parentValueMapper={(parent) => parent.style.children?.textColor}
								autoComplete="off"
							/>
						</div>
					</div>
				</div>

				<div className="h-px bg-gray-200" />

				{/* Background & Effects */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Background & Effects
						</Text>
					</div>
					<div className="space-y-3">
						<div>
							<ColorStyleField
								label="Background Color"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) => value.style.backgroundColor}
								nodeValueSetter={(node, value) => {
									node._v.style.backgroundColor = value;
									node._notify();
								}}
								parentValueMapper={(parent) => parent.style.children?.backgroundColor}
								autoComplete="off"
							/>
						</div>

						<div>
							<ToggleStyleField
								label="Shadow"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) => value.style.shadow}
								nodeValueSetter={(node, value) => {
									node._v.style.shadow = value;
									node._notify();
								}}
								parentValueMapper={(parent) => parent.style.children?.shadow}
								ariaLabel="Enable shadow"
							/>
						</div>
					</div>
				</div>
			</AccordionSection>
		</>
	);
};

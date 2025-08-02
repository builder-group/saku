import {
	fontMetadata,
	inheritStyle,
	isInheritedStyle,
	resolveStyleReference,
	TLinkNode
} from '@repo/editor';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { ColorStyleField, SelectStyleField, TextStyleField, ToggleStyleField } from '../../fields';
import { TNodeEditorComponentProps } from '../../nodeEditorRegistry';
import { DefaultLinkVariant } from './DefaultLinkVariant';
import { getAvailableVariants } from './environment';
import { extractYouTubeVideoId } from './lib';
import { YoutubeVideoEmbedVariant } from './YoutubeVideoEmbedVariant';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const [selectedVariantType, setSelectedVariantType] = React.useState<TVariantType>(() => {
		return content.variant.type;
	});
	const [isChangingVariant, setIsChangingVariant] = React.useState(false);

	const availableVariants = React.useMemo(() => getAvailableVariants(content.url), [content.url]);
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
		(value: TVariantType) => {
			setSelectedVariantType(value as TVariantType);

			// Preserve common properties when switching variants
			const currentTitle = 'title' in content.variant ? content.variant.title : undefined;
			const currentUserTitle =
				'userTitle' in content.variant ? content.variant.userTitle : undefined;

			switch (value) {
				case 'default':
					nodeState._v.content.variant = {
						type: 'default',
						title: currentTitle,
						userTitle: currentUserTitle
					};
					break;
				case 'youtube-video':
					nodeState._v.content.variant = {
						type: 'youtube-video',
						videoId: '',
						title: currentTitle,
						userTitle: currentUserTitle
					};
					break;
				case 'youtube-channel':
					nodeState._v.content.variant = {
						type: 'youtube-channel',
						channelId: '',
						title: currentTitle,
						userTitle: currentUserTitle
					};
					break;
				case 'youtube-video-embed': {
					const videoId = extractYouTubeVideoId(content.url) ?? '';
					nodeState._v.content.variant = {
						type: 'youtube-video-embed',
						videoId
					};
					break;
				}
			}

			nodeState._notify();
		},
		[content, nodeState]
	);

	const handleUrlChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.url = value;
			nodeState._notify({ listenerContext: { source: 'url-change' } });
		},
		[nodeState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	const renderVariantEditor = React.useCallback((): React.ReactElement | null => {
		switch (content.variant.type) {
			case 'default':
				return <DefaultLinkVariant nodeState={nodeState} editor={editor} />;
			case 'youtube-video':
				return (
					<div className="space-y-4">
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
					<div className="space-y-4">
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
				return <YoutubeVideoEmbedVariant nodeState={nodeState} editor={editor} />;
			default:
				return null;
		}
	}, [content.variant.type, editor, nodeState]);

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
							autoComplete="off"
							placeholder="https://example.com"
							type="url"
							disabled={isChangingVariant}
						/>
					</div>

					{/* Link variant */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Variant
						</Text>
						<Select
							id="link-display-field"
							label="Link display"
							labelHidden
							options={availableVariants}
							value={selectedVariantType}
							onChange={handleVariantTypeChange}
							disabled={availableVariants.length === 1 || isChangingVariant}
						/>
					</div>
				</div>

				<div className="h-px bg-gray-200" />

				{renderVariantEditor()}
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

type TVariantType = NonNullable<TLinkNode['content']['variant']>['type'];

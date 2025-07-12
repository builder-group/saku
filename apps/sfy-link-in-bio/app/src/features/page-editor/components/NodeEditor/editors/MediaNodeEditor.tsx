import { TMediaNode } from '@repo/editor';
import { InlineError, Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { ColorStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const MediaNodeEditor: React.FC<TNodeEditorComponentProps<TMediaNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const [mediaImageError, setImageError] = React.useState<string | null>(null);
	const mediaImage = React.useMemo(() => {
		const asset = editor.getImageAsset(content.media?.hash);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.media, editor]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleMediaTypeChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.media = { type: value as 'image', hash: '' };
			nodeState._notify();
		},
		[nodeState]
	);

	const handleMediaImageChange = React.useCallback(
		(value: TImageUploadOnChangeImage) => {
			const hash = editor.registerImage(value.url, value.fileName);
			if (hash != null) {
				nodeState._v.content.media = {
					type: 'image',
					hash,
					altText: value.fileName != null ? `Image: ${value.fileName}` : undefined
				};
				nodeState._notify();
			}
		},
		[nodeState, editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
				<div className="space-y-4">
					{/* Media Type */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Media type
						</Text>
						<Select
							id="media-type-field"
							label="Media type"
							labelHidden
							options={[{ label: 'Image', value: 'image' }]}
							value={content.media?.type ?? 'image'}
							onChange={handleMediaTypeChange}
						/>
					</div>

					{/* Image Type */}
					{content.media?.type === 'image' && (
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Image
							</Text>
							<ImageUploadField
								image={mediaImage}
								onChange={handleMediaImageChange}
								onError={setImageError}
							/>
							{mediaImageError != null && (
								<InlineError message={mediaImageError} fieldID="media-upload-error" />
							)}
						</div>
					)}
				</div>
			</AccordionSection>

			{/* Style Section */}
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
						/>
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

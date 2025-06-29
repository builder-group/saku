import { InlineError, Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { TMediaNode } from '../../../types';
import { TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const MediaNodeEditor: React.FC<TNodeEditorComponentProps<TMediaNode>> = (props) => {
	const { nodeState, editor } = props;
	const node = useFeatureState(nodeState);

	const [imageError, setImageError] = React.useState<string | null>(null);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleMediaTypeChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({
				...prev,
				media: { type: value as 'image', url: '', altText: undefined }
			}));
		},
		[nodeState]
	);

	const handleImageChange = React.useCallback(
		(value: TImageUploadOnChangeImage) => {
			nodeState.set((prev) => ({
				...prev,
				media: {
					type: 'image',
					url: value.url,
					altText: value.fileName ? `Image: ${value.fileName}` : undefined
				}
			}));
		},
		[nodeState]
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
							value={node.media?.type ?? 'image'}
							onChange={handleMediaTypeChange}
						/>
					</div>

					{/* Image Type */}
					{node.media?.type === 'image' && (
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Image
							</Text>
							<ImageUploadField
								image={node.media}
								onChange={handleImageChange}
								onError={setImageError}
							/>
							{imageError != null && (
								<InlineError message={imageError} fieldID="media-upload-error" />
							)}
						</div>
					)}
				</div>
			</AccordionSection>

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true}>
				<div className="space-y-3">
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
							label="Margin"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.margin}
							nodeValueSetter={(node, value) => {
								node._v.style.margin = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.margin}
							type="number"
							autoComplete="off"
						/>
					</div>

					<TextStyleField
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
			</AccordionSection>
		</>
	);
};

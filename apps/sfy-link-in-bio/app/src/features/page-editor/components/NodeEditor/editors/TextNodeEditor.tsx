import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { fontMetadata } from '../../../environment';
import { TTextNode } from '../../../types';
import { SelectStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const TextNodeEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, editor } = props;
	const node = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			if (value === '') {
				nodeState.set((prev) => ({ ...prev, title: undefined }));
			} else {
				nodeState.set((prev) => ({ ...prev, title: value }));
			}
		},
		[nodeState]
	);

	const handleTextChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({ ...prev, text: value }));
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
					{/* Title */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Title
						</Text>
						<TextField
							id="title-field"
							label="Title"
							labelHidden
							value={node.title ?? ''}
							onChange={handleTitleChange}
							autoComplete="off"
							placeholder="Add your title here"
						/>
					</div>

					{/* Text */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Text
						</Text>
						<TextField
							id="text-field"
							label="Text"
							labelHidden
							value={node.text}
							onChange={handleTextChange}
							multiline={4}
							autoComplete="off"
							placeholder="Add your text here"
						/>
					</div>
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

					<SelectStyleField
						label="Font Family"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) =>
							value.style.font === 'inherit' ? 'inherit' : value.style.font?.family
						}
						nodeValueSetter={(node, value) => {
							if (value === 'inherit') {
								node._v.style.font = 'inherit' as const;
								node._notify();
							} else if (value != null) {
								const font = editor.registerFontFamily(value);
								if (font != null) {
									node._v.style.font = font;
									node._notify();
								}
							}
						}}
						parentValueMapper={(parent) => parent.style.children?.font?.family}
						options={fontOptions}
					/>

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
						/>

						<TextStyleField
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

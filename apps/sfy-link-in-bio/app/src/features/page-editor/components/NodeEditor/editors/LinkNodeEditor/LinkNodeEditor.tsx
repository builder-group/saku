import {
	fontMetadata,
	inheritStyle,
	isInheritedStyle,
	resolveStyleReference,
	TLinkNode
} from '@repo/editor';
import { Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { ColorStyleField, SelectStyleField, TextStyleField, ToggleStyleField } from '../../fields';
import { TNodeEditorComponentProps } from '../../nodeEditorRegistry';
import { DefaultLinkVariantEditor } from './DefaultLinkVariantEditor';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	const renderVariantEditor = React.useCallback((): React.ReactElement | null => {
		switch (content.variant.type) {
			case 'default':
				return <DefaultLinkVariantEditor nodeState={nodeState} editor={editor} />;
			case 'youtube':
				return (
					<div className="space-y-4">
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								YouTube Link
							</Text>
							<Text as="p" variant="bodyMd" tone="subdued">
								YouTube editor coming soon...
							</Text>
						</div>
					</div>
				);
			default:
				return null;
		}
	}, [content.variant.type, editor, nodeState]);

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
				<div className="space-y-4">
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Link type
						</Text>
						<Select
							id="link-type-field"
							label="Link type"
							labelHidden
							options={[
								{ label: 'Default', value: 'default' },
								{ label: 'YouTube', value: 'youtube' }
							]}
							value={content.variant.type}
							onChange={(value) => {
								// TODO: Handle variant type change
								console.log('Variant change:', value);
							}}
						/>
					</div>

					{renderVariantEditor()}
				</div>
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

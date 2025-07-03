import { fontMetadata, TPageNode } from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { AccordionSection } from '@/components';
import { ColorStyleField, SelectStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TPageNode>> = (props) => {
	const { nodeState, editor } = props;

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Page Style Section */}
			<AccordionSection title="Style" defaultOpen={true}>
				<div className="space-y-3">
					<ColorStyleField
						label="Background Color"
						node={nodeState}
						nodeValueMapper={(value) => value.style.backgroundColor}
						nodeValueSetter={(node, value) => {
							node._v.style.backgroundColor = value;
							node._notify();
						}}
						autoComplete="off"
						placeholder="#F8F9FA"
					/>
				</div>
			</AccordionSection>

			{/* Child Style Section */}
			<AccordionSection
				title="Child Style"
				defaultOpen={true}
				collapsibleClassName="px-0 space-y-3"
			>
				{/* Layout & Spacing */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Layout & Spacing
						</Text>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<TextStyleField
							label="Spacing"
							node={nodeState}
							nodeValueMapper={(value) => value.style.children?.spacing}
							nodeValueSetter={(node, value) => {
								if (node._v.style.children != null) {
									node._v.style.children.spacing = value;
									node._notify();
								}
							}}
							type="number"
							autoComplete="off"
							placeholder="16"
						/>

						<TextStyleField
							label="Padding"
							node={nodeState}
							nodeValueMapper={(value) => value.style.children?.padding}
							nodeValueSetter={(node, value) => {
								if (node._v.style.children != null) {
									node._v.style.children.padding = value;
									node._notify();
								}
							}}
							type="number"
							autoComplete="off"
							placeholder="16"
						/>

						<TextStyleField
							label="Border Radius"
							node={nodeState}
							nodeValueMapper={(value) => value.style.children?.borderRadius}
							nodeValueSetter={(node, value) => {
								if (node._v.style.children != null) {
									node._v.style.children.borderRadius = value;
									node._notify();
								}
							}}
							type="number"
							autoComplete="off"
							placeholder="12"
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
								nodeValueMapper={(value) => value.style.children?.font?.family}
								nodeValueSetter={(node, value) => {
									if (node._v.style.children != null && value != null) {
										const font = editor.registerFontFamily(value);
										if (font != null) {
											node._v.style.children.font = font;
											node._notify();
										}
									}
								}}
								options={fontOptions}
							/>

							<SelectStyleField
								label="Text Align"
								node={nodeState}
								nodeValueMapper={(value) => value.style.children?.textAlign}
								nodeValueSetter={(node, value) => {
									if (node._v.style.children != null) {
										node._v.style.children.textAlign = value;
										node._notify();
									}
								}}
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
								nodeValueMapper={(value) => value.style.children?.fontSize}
								nodeValueSetter={(node, value) => {
									if (node._v.style.children != null) {
										node._v.style.children.fontSize = value;
										node._notify();
									}
								}}
								type="number"
								autoComplete="off"
								placeholder="16"
							/>

							<ColorStyleField
								label="Text Color"
								node={nodeState}
								nodeValueMapper={(value) => value.style.children?.textColor}
								nodeValueSetter={(node, value) => {
									if (node._v.style.children != null) {
										node._v.style.children.textColor = value;
										node._notify();
									}
								}}
								autoComplete="off"
								placeholder="#2F4F4F"
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
								nodeValueMapper={(value) => value.style.children?.backgroundColor}
								nodeValueSetter={(node, value) => {
									if (node._v.style.children != null) {
										node._v.style.children.backgroundColor = value;
										node._notify();
									}
								}}
								autoComplete="off"
								placeholder="#FFFFFF"
							/>
						</div>

						<div>
							<ToggleStyleField
								label="Shadow"
								node={nodeState}
								nodeValueMapper={(value) => value.style.children?.shadow}
								nodeValueSetter={(node, value) => {
									if (node._v.style.children != null) {
										node._v.style.children.shadow = value;
										node._notify();
									}
								}}
								ariaLabel="Enable shadow for child elements"
							/>
						</div>
					</div>
				</div>
			</AccordionSection>
		</>
	);
};

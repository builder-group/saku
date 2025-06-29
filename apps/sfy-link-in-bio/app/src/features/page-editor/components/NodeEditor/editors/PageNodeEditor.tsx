import { Text } from '@shopify/polaris';
import React from 'react';
import { AccordionSection } from '@/components';
import { TPageNode } from '../../../types';
import { SelectStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TPageNode>> = (props) => {
	const { nodeState } = props;

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Page Styling Section */}
			<AccordionSection title="Page Styling" defaultOpen={true}>
				<div className="space-y-3">
					<TextStyleField
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

			{/* Child Defaults Section */}
			<AccordionSection title="Child Defaults" defaultOpen={true}>
				<div className="space-y-3">
					<Text as="p" variant="bodySm" tone="subdued">
						These settings define the default styles for all child elements (links, text, media,
						etc.). Children can inherit these values or override them individually.
					</Text>

					<div className="grid grid-cols-2 gap-3">
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

					<div className="grid grid-cols-2 gap-3">
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
							label="Margin"
							node={nodeState}
							nodeValueMapper={(value) => value.style.children?.margin}
							nodeValueSetter={(node, value) => {
								if (node._v.style.children != null) {
									node._v.style.children.margin = value;
									node._notify();
								}
							}}
							type="number"
							autoComplete="off"
							placeholder="8"
						/>
					</div>

					<TextStyleField
						label="Font Family"
						node={nodeState}
						nodeValueMapper={(value) => value.style.children?.fontFamily}
						nodeValueSetter={(node, value) => {
							if (node._v.style.children != null) {
								node._v.style.children.fontFamily = value;
								node._notify();
							}
						}}
						autoComplete="off"
						placeholder="Inter"
					/>

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

						<TextStyleField
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

					<div className="grid grid-cols-2 gap-3">
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
			</AccordionSection>
		</>
	);
};

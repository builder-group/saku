import {
	fontMetadata,
	inherit,
	isInherited,
	resolveReference,
	TFlatNode,
	TMergeMixins,
	TTypographyStyleMixin,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { ColorStyleField, SelectStyleField, TextStyleField } from '../../components';
import { TNodeState, TPageEditor } from '../../lib';

export const TypographyStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TTypographyStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState, editor } = props;

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	return (
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
							isInherited(value.typography.font)
								? { type: 'inherit' }
								: resolveReference(value.typography.font)?.family
						}
						nodeValueSetter={(node, value) => {
							if (isInherited(value)) {
								node._v.typography.font = inherit();
								node._notify();
							} else if (value != null) {
								const font = editor.registerFontFamily(value);
								if (font != null) {
									node._v.typography.font = font;
									node._notify();
								}
							}
						}}
						parentValueMapper={(parent) => parent.childMixins?.typography?.font?.family}
						options={fontOptions}
					/>

					<SelectStyleField
						label="Text Align"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.typography.textAlign}
						nodeValueSetter={(node, value) => {
							node._v.typography.textAlign = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.childMixins?.typography?.textAlign}
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
						nodeValueMapper={(value) => value.typography.fontSize}
						nodeValueSetter={(node, value) => {
							node._v.typography.fontSize = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.childMixins?.typography?.fontSize}
						type="number"
						autoComplete="off"
					/>

					<ColorStyleField
						label="Text Color"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.typography.textColor}
						nodeValueSetter={(node, value) => {
							node._v.typography.textColor = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.childMixins?.typography?.textColor}
						autoComplete="off"
					/>
				</div>
			</div>
		</div>
	);
};

interface TTypographyStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TTypographyStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TTypographyStyleMixin>]>;
		}
	>;
	editor: TPageEditor;
}

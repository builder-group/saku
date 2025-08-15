import {
	fontMetadata,
	TFlatNode,
	TMergeMixins,
	TRgba,
	TTypographyStyleMixin,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { ColorStyleField, SelectStyleField, TextStyleField } from '../../components';
import { TNodeState, TPageEditor } from '../../lib';

export const ChildTypographyStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildTypographyStyleMixinEditorProps<GNode>
) => {
	const { nodeState, editor } = props;

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
						nodeValueMapper={(value) => value.childMixins?.typography?.font?.family}
						nodeValueSetter={(node, value) => {
							if (value != null) {
								const font = editor.registerFontFamily(value as string);
								if (font != null) {
									node._v.childMixins.typography.font = font;
									node._notify();
								}
							}
						}}
						options={fontOptions}
					/>

					<SelectStyleField
						label="Text Align"
						node={nodeState}
						nodeValueMapper={(value) => value.childMixins?.typography?.textAlign}
						nodeValueSetter={(node, value) => {
							node._v.childMixins.typography.textAlign = value as 'left' | 'center' | 'right';
							node._notify();
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
						nodeValueMapper={(value) => value.childMixins?.typography?.fontSize}
						nodeValueSetter={(node, value) => {
							node._v.childMixins.typography.fontSize = value as number;
							node._notify();
						}}
						type="number"
						autoComplete="off"
					/>

					<ColorStyleField
						label="Text Color"
						node={nodeState}
						nodeValueMapper={(value) => value.childMixins?.typography?.textColor}
						nodeValueSetter={(node, value) => {
							node._v.childMixins.typography.textColor = value as TRgba;
							node._notify();
						}}
						autoComplete="off"
					/>
				</div>
			</div>
		</div>
	);
};

interface TChildTypographyStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<
		GNode & { childMixins: TMergeMixins<[TUnreference<TTypographyStyleMixin>]> }
	>;
	editor: TPageEditor;
}

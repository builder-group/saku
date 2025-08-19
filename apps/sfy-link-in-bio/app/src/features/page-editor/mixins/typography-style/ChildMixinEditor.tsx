import {
	fontMetadata,
	TFlatNode,
	TMergeMixins,
	TTypographyStyleMixin,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { MappedColorInput, MappedSelectInput, MappedTextInput } from '@/components';
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
					<MappedSelectInput
						label="Font Family"
						options={fontOptions}
						state={nodeState}
						mapValue={(value) => value.childMixins?.typography?.font?.family}
						onValueChange={(value) => {
							if (value != null) {
								const font = editor.registerFontFamily(value as string);
								if (font != null) {
									nodeState._v.childMixins.typography.font = font;
									nodeState._notify();
								}
							}
						}}
						disableFieldInheritance
					/>

					<MappedSelectInput
						label="Text Align"
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
						state={nodeState}
						mapValue={(value) => value.childMixins?.typography?.textAlign}
						onValueChange={(value) => {
							if (value != null) {
								nodeState._v.childMixins.typography.textAlign = value;
								nodeState._notify();
							}
						}}
						disableFieldInheritance
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<MappedTextInput
						label="Font Size"
						type="number"
						autoComplete="off"
						min={8}
						max={96}
						step={4}
						state={nodeState}
						mapValue={(value) => value.childMixins?.typography?.fontSize}
						onValueChange={(value) => {
							if (value != null) {
								nodeState._v.childMixins.typography.fontSize = value;
								nodeState._notify();
							}
						}}
						disableFieldInheritance
					/>

					<MappedColorInput
						label="Text Color"
						autoComplete="off"
						state={nodeState}
						mapValue={(value) => value.childMixins?.typography?.textColor}
						onValueChange={(value) => {
							if (value != null) {
								nodeState._v.childMixins.typography.textColor = value;
								nodeState._notify();
							}
						}}
						disableFieldInheritance
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

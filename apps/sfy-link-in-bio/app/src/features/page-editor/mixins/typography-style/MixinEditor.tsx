import {
	fontMetadata,
	inherit,
	isInherited,
	resolveReference,
	TFlatNode,
	TMergeMixins,
	TReference,
	TRgba,
	TTextAlign,
	TTypographyStyleMixin,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { MappedColorInput, MappedSelectInput, MappedTextInput } from '@/components';
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
					<MappedSelectInput
						label="Font Family"
						options={fontOptions}
						state={nodeState}
						parentState={parentNodeState}
						mapValue={(value) =>
							isInherited(value.typography.font)
								? { type: 'inherit' }
								: resolveReference(value.typography.font)?.family
						}
						onValueChange={(value) => {
							if (value != null) {
								const font = editor.registerFontFamily(value);
								if (font != null) {
									nodeState._v.typography.font = font;
									nodeState._notify();
								}
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.font?.family}
						onInheritChange={(shouldInherit, parentValue) => {
							if (shouldInherit) {
								nodeState._v.typography.font = inherit();
								nodeState._notify();
							} else {
								const font = editor.registerFontFamily(parentValue as string);
								if (font != null) {
									nodeState._v.typography.font = font;
									nodeState._notify();
								}
							}
						}}
						onInheritedBadgeClick={() => {
							editor.switchView('settings');
						}}
					/>

					<MappedSelectInput
						label="Text Align"
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
						state={nodeState}
						parentState={parentNodeState}
						mapValue={(value) => value.typography.textAlign}
						onValueChange={(value) => {
							if (value != null) {
								nodeState._v.typography.textAlign = value;
								nodeState._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.textAlign}
						onInheritChange={(shouldInherit, parentValue) => {
							nodeState._v.typography.textAlign = shouldInherit
								? inherit()
								: (parentValue as TReference<TTextAlign>);
							nodeState._notify();
						}}
						onInheritedBadgeClick={() => {
							editor.switchView('settings');
						}}
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
						parentState={parentNodeState}
						mapValue={(value) => value.typography.fontSize}
						onValueChange={(value) => {
							if (value != null) {
								nodeState._v.typography.fontSize = value;
								nodeState._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.fontSize}
						onInheritChange={(shouldInherit, parentValue) => {
							nodeState._v.typography.fontSize = shouldInherit
								? inherit()
								: (parentValue as TReference<number>);
							nodeState._notify();
						}}
						onInheritedBadgeClick={() => {
							editor.switchView('settings');
						}}
					/>

					<MappedColorInput
						label="Text Color"
						autoComplete="off"
						state={nodeState}
						parentState={parentNodeState}
						mapValue={(value) => value.typography.textColor}
						onValueChange={(value) => {
							if (value != null) {
								nodeState._v.typography.textColor = value;
								nodeState._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.textColor}
						onInheritChange={(shouldInherit, parentValue) => {
							nodeState._v.typography.textColor = shouldInherit
								? inherit()
								: (parentValue as TReference<TRgba>);
							nodeState._notify();
						}}
						onInheritedBadgeClick={() => {
							editor.switchView('settings');
						}}
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

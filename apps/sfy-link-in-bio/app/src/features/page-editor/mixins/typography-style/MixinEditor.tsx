import {
	fontMetadata,
	inherit,
	isInherited,
	resolveReference,
	TMergeMixins,
	TRgba,
	TTextAlign,
	TTypographyStyleMixin,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { MappedColorInput, MappedSelectInput, MappedTextInput } from '@/components';
import { TPageEditor } from '../../lib';

export const TypographyStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TTypographyStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

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
						state={state}
						parentState={parentState}
						mapValue={(value) =>
							isInherited(value.typography.font)
								? { type: 'inherit' }
								: resolveReference(value.typography.font)?.family
						}
						onValueChange={(value) => {
							if (value != null) {
								const font = editor.registerFontFamily(value);
								if (font != null) {
									state._v.typography.font = font;
									state._notify();
								}
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.font?.family}
						onInheritChange={(shouldInherit, parentValue) => {
							if (shouldInherit) {
								state._v.typography.font = inherit();
								state._notify();
							} else {
								const font = editor.registerFontFamily(parentValue as string);
								if (font != null) {
									state._v.typography.font = font;
									state._notify();
								}
							}
						}}
						onNavigateToParent={() => {
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
						state={state}
						parentState={parentState}
						mapValue={(value) => value.typography.textAlign}
						onValueChange={(value) => {
							if (value != null) {
								state._v.typography.textAlign = value;
								state._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.textAlign}
						onInheritChange={(shouldInherit, parentValue) => {
							state._v.typography.textAlign = shouldInherit
								? inherit()
								: (parentValue as TTextAlign);
							state._notify();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<MappedTextInput
						label="Font Size"
						type="number"
						autoComplete="off"
						min={0}
						max={96}
						step={4}
						state={state}
						parentState={parentState}
						mapValue={(value) => value.typography.fontSize}
						onValueChange={(value) => {
							if (value != null) {
								state._v.typography.fontSize = value;
								state._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.fontSize}
						onInheritChange={(shouldInherit, parentValue) => {
							state._v.typography.fontSize = shouldInherit ? inherit() : (parentValue as number);
							state._notify();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
					/>

					<MappedColorInput
						label="Text Color"
						autoComplete="off"
						state={state}
						parentState={parentState}
						mapValue={(value) => value.typography.textColor}
						onValueChange={(value) => {
							if (value != null) {
								state._v.typography.textColor = value;
								state._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.textColor}
						onInheritChange={(shouldInherit, parentValue) => {
							state._v.typography.textColor = shouldInherit ? inherit() : (parentValue as TRgba);
							state._notify();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
					/>
				</div>
			</div>
		</div>
	);
};

interface TTypographyStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TTypographyStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TTypographyStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

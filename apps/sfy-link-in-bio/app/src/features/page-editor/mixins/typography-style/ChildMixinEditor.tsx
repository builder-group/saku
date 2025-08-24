import { fontMetadata, TMergeMixins, TTypographyStyleMixin, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { MappedSelectInput, MappedTextInput } from '@/components';
import { TPageEditor } from '../../lib';

export const ChildTypographyStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildTypographyStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

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
						mapValue={(value) => value.childMixins?.typography?.font?.family}
						onValueChange={(value) => {
							if (value != null) {
								const font = editor.registerFontFamily(value as string);
								if (font != null) {
									state._v.childMixins.typography.font = font;
									state._notify();
								}
							}
						}}
						disableFieldInheritance
					/>
					<MappedTextInput
						label="Font Size"
						type="number"
						autoComplete="off"
						min={8}
						max={96}
						step={4}
						state={state}
						mapValue={(value) => value.childMixins?.typography?.fontSize}
						onValueChange={(value) => {
							if (value != null) {
								state._v.childMixins.typography.fontSize = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<MappedSelectInput
						label="Horizontal Text Align"
						options={[
							{ label: 'Start', value: 'start' },
							{ label: 'Center', value: 'center' },
							{ label: 'End', value: 'end' }
						]}
						state={state}
						mapValue={(value) => value.childMixins?.typography?.textAlignHorizontal}
						onValueChange={(value) => {
							if (value != null) {
								state._v.childMixins.typography.textAlignHorizontal = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
					<MappedSelectInput
						label="Vertical Text Align"
						options={[
							{ label: 'Start', value: 'start' },
							{ label: 'Center', value: 'center' },
							{ label: 'End', value: 'end' }
						]}
						state={state}
						mapValue={(value) => value.childMixins?.typography?.textAlignVertical}
						onValueChange={(value) => {
							if (value != null) {
								state._v.childMixins.typography.textAlignVertical = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
				</div>
			</div>
		</div>
	);
};

interface TChildTypographyStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TTypographyStyleMixin>]> }, any>;
	editor: TPageEditor;
}

import {
	fontMetadata,
	inherit,
	isInherited,
	isTokenRef,
	resolveReference,
	TMergeMixins,
	TRef,
	TTextAlign,
	TTypographyStyleMixin,
	TUnreference,
	uninherit
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { MappedSelectInput, MappedTextInput } from '@/components';
import { useMapState } from '@/hooks';
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

	const fontFamilyState = useMapState(state, {
		map(baseValue): TRef<string> {
			if (isTokenRef(baseValue.typography)) {
				return baseValue.typography;
			}
			if (isTokenRef(baseValue.typography.font)) {
				return baseValue.typography.font;
			}
			return uninherit(baseValue.typography.font).family;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.typography)) {
				if (isTokenRef(mappedValue)) {
					baseState._v.typography.font = mappedValue;
					baseState._notify(notifyOptions);
				} else {
					const font = editor.registerFontFamily(mappedValue as string);
					if (font != null) {
						baseState._v.typography.font = font;
						state._notify();
					}
				}
			}
		}
	});

	// const fontSizeState = useMapState(state, {
	// 	map(baseValue) {
	// 		if (isTokenRef(baseValue.typography)) {
	// 			return baseValue.typography;
	// 		}
	// 		return baseValue.typography.fontSize;
	// 	},
	// 	sync(baseState, mappedValue, notifyOptions) {
	// 		if (!isTokenRef(baseState._v.typography)) {
	// 			baseState._v.typography.fontSize = mappedValue;
	// 			baseState._notify(notifyOptions);
	// 		}
	// 	}
	// });
	// const fontSizeToken = useMapState(editor.tokensMap.typography, {
	// 	map(baseValue) {
	// 		return Object.fromEntries(
	// 			Object.entries(baseValue).map(([key, value]) => [key, value.fontSize])
	// 		);
	// 	}
	// });

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
						parentState={parentState}
						mapValue={(value) => value.typography.textAlignHorizontal}
						onValueChange={(value) => {
							if (value != null) {
								state._v.typography.textAlignHorizontal = value;
								state._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.textAlignHorizontal}
						onInheritChange={(shouldInherit, parentValue) => {
							state._v.typography.textAlignHorizontal = shouldInherit
								? inherit()
								: (parentValue as TTextAlign);
							state._notify();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
					/>
					<MappedSelectInput
						label="Vertical Text Align"
						options={[
							{ label: 'Start', value: 'start' },
							{ label: 'Center', value: 'center' },
							{ label: 'End', value: 'end' }
						]}
						state={state}
						parentState={parentState}
						mapValue={(value) => value.typography.textAlignVertical}
						onValueChange={(value) => {
							if (value != null) {
								state._v.typography.textAlignVertical = value;
								state._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins?.typography?.textAlignVertical}
						onInheritChange={(shouldInherit, parentValue) => {
							state._v.typography.textAlignVertical = shouldInherit
								? inherit()
								: (parentValue as TTextAlign);
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

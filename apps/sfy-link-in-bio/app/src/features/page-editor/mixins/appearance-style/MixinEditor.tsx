import {
	inherit,
	isInherited,
	TAppearanceStyleMixin,
	TMergeMixins,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { HideIcon, MappedTextInput, ViewIcon } from '@/components';
import { TPageEditor } from '../../lib';

export const AppearanceStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TAppearanceStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const hasBorderRadius = useCompute(state, ({ value }) => value.appearance.borderRadius != null);

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleVisibility = React.useCallback(() => {
		state._v.appearance.visible = !state._v.appearance.visible;
		state._notify();
	}, [state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Appearance
				</Text>

				{state._v.appearance.visible ? (
					<Button icon={ViewIcon} onClick={handleToggleVisibility} variant="plain" size="micro" />
				) : (
					<Button icon={HideIcon} onClick={handleToggleVisibility} variant="plain" size="micro" />
				)}
			</div>
			<div className="grid grid-cols-2 gap-3">
				<MappedTextInput
					label="Opacity"
					type="number"
					autoComplete="off"
					min={0}
					max={100}
					step={5}
					state={state}
					parentState={parentState}
					mapValue={(value) =>
						isInherited(value.appearance.opacity)
							? inherit()
							: (value.appearance.opacity as number) * 100
					}
					onValueChange={(value) => {
						if (value != null) {
							state._v.appearance.opacity = value / 100;
							state._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins.appearance.opacity * 100}
					onInheritChange={(shouldInherit, parentValue) => {
						state._v.appearance.opacity = shouldInherit ? inherit() : (parentValue as number) / 100;
						state._notify();
					}}
					onNavigateToParent={() => {
						editor.switchView('settings');
					}}
					disableFieldInheritance={parentState == null}
				/>
				{hasBorderRadius && (
					<MappedTextInput
						label="Border Radius"
						type="number"
						autoComplete="off"
						min={0}
						max={999}
						step={4}
						state={state}
						parentState={parentState}
						mapValue={(value) => value.appearance.borderRadius}
						onValueChange={(value) => {
							if (value != null) {
								state._v.appearance.borderRadius = value;
								state._notify();
							}
						}}
						mapParentValue={(parent) => parent.childMixins.appearance.borderRadius}
						onInheritChange={(shouldInherit, parentValue) => {
							state._v.appearance.borderRadius = shouldInherit
								? inherit()
								: (parentValue as number);
							state._notify();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance={parentState == null}
					/>
				)}
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TAppearanceStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TAppearanceStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

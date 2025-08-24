import { inherit, TAutoLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import { MappedTextInput } from '@/components';
import { TPageEditor } from '../../lib';

export const AutoLayoutStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TAutoLayoutStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const { hasHorizontalPadding, hasVerticalPadding, hasHorizontalGap, hasVerticalGap } = useCompute(
		state,
		({ value }) => {
			return {
				hasHorizontalPadding: value.autoLayout.horizontalPadding != null,
				hasVerticalPadding: value.autoLayout.verticalPadding != null,
				hasHorizontalGap: value.autoLayout.horizontalGap != null,
				hasVerticalGap: value.autoLayout.verticalGap != null
			};
		}
	);

	if (!hasHorizontalPadding && !hasVerticalPadding && !hasHorizontalGap && !hasVerticalGap) {
		return null;
	}

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Layout
				</Text>
			</div>
			{(hasHorizontalPadding || hasVerticalPadding) && (
				<div className="grid grid-cols-2 gap-3">
					{hasHorizontalPadding && (
						<MappedTextInput
							label="Horizontal Padding"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={state}
							parentState={parentState}
							mapValue={(value) => value.autoLayout.horizontalPadding}
							onValueChange={(value) => {
								if (value != null) {
									state._v.autoLayout.horizontalPadding = value;
									state._notify();
								}
							}}
							mapParentValue={(parent) => parent.childMixins?.autoLayout?.horizontalPadding}
							onInheritChange={(shouldInherit, parentValue) => {
								state._v.autoLayout.horizontalPadding = shouldInherit
									? inherit()
									: (parentValue as number);
								state._notify();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
						/>
					)}
					{hasVerticalPadding && (
						<MappedTextInput
							label="Vertical Padding"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={state}
							parentState={parentState}
							mapValue={(value) => value.autoLayout.verticalPadding}
							onValueChange={(value) => {
								if (value != null) {
									state._v.autoLayout.verticalPadding = value;
									state._notify();
								}
							}}
							mapParentValue={(parent) => parent.childMixins?.autoLayout?.verticalPadding}
							onInheritChange={(shouldInherit, parentValue) => {
								state._v.autoLayout.verticalPadding = shouldInherit
									? inherit()
									: (parentValue as number);
								state._notify();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
						/>
					)}
				</div>
			)}
			{(hasHorizontalGap || hasVerticalGap) && (
				<div className="grid grid-cols-2 gap-3">
					{hasHorizontalGap && (
						<MappedTextInput
							label="Horizontal Gap"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={state}
							parentState={parentState}
							mapValue={(value) => value.autoLayout.horizontalGap}
							onValueChange={(value) => {
								if (value != null) {
									state._v.autoLayout.horizontalGap = value;
									state._notify();
								}
							}}
							mapParentValue={(parent) => parent.childMixins?.autoLayout?.horizontalGap}
							onInheritChange={(shouldInherit, parentValue) => {
								state._v.autoLayout.horizontalGap = shouldInherit
									? inherit()
									: (parentValue as number);
								state._notify();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
						/>
					)}
					{hasVerticalGap && (
						<MappedTextInput
							label="Vertical Gap"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={state}
							parentState={parentState}
							mapValue={(value) => value.autoLayout.verticalGap}
							onValueChange={(value) => {
								if (value != null) {
									state._v.autoLayout.verticalGap = value;
									state._notify();
								}
							}}
							mapParentValue={(parent) => parent.childMixins?.autoLayout?.verticalGap}
							onInheritChange={(shouldInherit, parentValue) => {
								state._v.autoLayout.verticalGap = shouldInherit
									? inherit()
									: (parentValue as number);
								state._notify();
							}}
							onNavigateToParent={() => {
								editor.switchView('settings');
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface TAutoLayoutStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TAutoLayoutStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TAutoLayoutStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

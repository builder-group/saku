import { inherit, TLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { MappedTextInput } from '@/components';
import { TPageEditor } from '../../lib';

export const LayoutStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TLayoutStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Layout
				</Text>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<MappedTextInput
					label="Padding"
					type="number"
					autoComplete="off"
					min={0}
					max={96}
					step={4}
					state={state}
					parentState={parentState}
					mapValue={(value) => value.layout.padding}
					onValueChange={(value) => {
						if (value != null) {
							state._v.layout.padding = value;
							state._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins?.layout?.padding}
					onInheritChange={(shouldInherit, parentValue) => {
						state._v.layout.padding = shouldInherit ? inherit() : (parentValue as number);
						state._notify();
					}}
					onNavigateToParent={() => {
						editor.switchView('settings');
					}}
				/>
			</div>
		</div>
	);
};

interface TLayoutStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TLayoutStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TLayoutStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

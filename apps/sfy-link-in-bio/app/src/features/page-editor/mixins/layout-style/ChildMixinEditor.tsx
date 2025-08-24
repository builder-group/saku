import { TLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { MappedTextInput } from '@/components';

export const ChildLayoutStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildLayoutStyleMixinEditorProps<GValue>
) => {
	const { state } = props;

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
					max={100}
					step={2}
					state={state}
					mapValue={(value) => value.childMixins?.layout?.padding}
					onValueChange={(value) => {
						if (value != null) {
							state._v.childMixins.layout.padding = value;
							state._notify();
						}
					}}
					disableFieldInheritance
				/>
			</div>
		</div>
	);
};

interface TChildLayoutStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TLayoutStyleMixin>]> }, any>;
}

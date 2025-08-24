import { TAppearanceStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import { MappedTextInput } from '@/components';

export const ChildAppearanceStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildAppearanceStyleMixinEditorProps<GValue>
) => {
	const { state } = props;

	const hasBorderRadius = useCompute(
		state,
		({ value }) => value.childMixins.appearance.borderRadius != null
	);

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Appearance
				</Text>
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
					mapValue={(value) => value.childMixins?.appearance?.opacity * 100}
					onValueChange={(value) => {
						if (value != null) {
							state._v.childMixins.appearance.opacity = value / 100;
							state._notify();
						}
					}}
					disableFieldInheritance
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
						mapValue={(value) => value.childMixins?.appearance?.borderRadius}
						onValueChange={(value) => {
							if (value != null) {
								state._v.childMixins.appearance.borderRadius = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
				)}
			</div>
		</div>
	);
};

interface TChildAppearanceStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TAppearanceStyleMixin>]> }, any>;
}

import { TAutoLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import { MappedTextInput } from '@/components';

export const ChildAutoLayoutStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildAutoLayoutStyleMixinEditorProps<GValue>
) => {
	const { state } = props;

	const { hasHorizontalPadding, hasVerticalPadding, hasHorizontalGap, hasVerticalGap } = useCompute(
		state,
		({ value }) => {
			return {
				hasHorizontalPadding: value.childMixins?.autoLayout?.horizontalPadding != null,
				hasVerticalPadding: value.childMixins?.autoLayout?.verticalPadding != null,
				hasHorizontalGap: value.childMixins?.autoLayout?.horizontalGap != null,
				hasVerticalGap: value.childMixins?.autoLayout?.verticalGap != null
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
							mapValue={(value) => value.childMixins?.autoLayout?.horizontalPadding}
							onValueChange={(value) => {
								if (value != null) {
									state._v.childMixins.autoLayout.horizontalPadding = value;
									state._notify();
								}
							}}
							disableFieldInheritance
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
							mapValue={(value) => value.childMixins?.autoLayout?.verticalPadding}
							onValueChange={(value) => {
								if (value != null) {
									state._v.childMixins.autoLayout.verticalPadding = value;
									state._notify();
								}
							}}
							disableFieldInheritance
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
							mapValue={(value) => value.childMixins?.autoLayout?.horizontalGap}
							onValueChange={(value) => {
								if (value != null) {
									state._v.childMixins.autoLayout.horizontalGap = value;
									state._notify();
								}
							}}
							disableFieldInheritance
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
							mapValue={(value) => value.childMixins?.autoLayout?.verticalGap}
							onValueChange={(value) => {
								if (value != null) {
									state._v.childMixins.autoLayout.verticalGap = value;
									state._notify();
								}
							}}
							disableFieldInheritance
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface TChildAutoLayoutStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TAutoLayoutStyleMixin>]> }, any>;
}

import { TMergeMixins, TShadowStyleMixin, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { MappedColorInput, MappedTextInput, MinusIcon, PlusIcon } from '@/components';

export const ChildShadowStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildShadowStyleMixinEditorProps<GValue>
) => {
	const { state } = props;

	const currentShadow = useCompute(state, ({ value }) => {
		return value.childMixins?.shadow;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddShadow = React.useCallback(() => {
		state._v.childMixins.shadow = {
			color: { r: 0, g: 0, b: 0, a: 0.3 },
			offsetX: 0,
			offsetY: 2,
			blur: 4,
			spread: 0
		};
		state._notify();
	}, [state]);

	const handleRemoveShadow = React.useCallback(() => {
		state._v.childMixins.shadow = null;
		state._notify();
	}, [state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Shadow
				</Text>

				{/* Add/Remove shadow buttons */}
				{currentShadow != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveShadow} variant="plain" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddShadow} variant="plain" />
				)}
			</div>

			{currentShadow != null && (
				<div className="space-y-3">
					<MappedColorInput
						label="Color"
						autoComplete="off"
						state={state}
						mapValue={(value) => value.childMixins?.shadow?.color}
						onValueChange={(value) => {
							if (value != null && state._v.childMixins?.shadow != null) {
								state._v.childMixins.shadow.color = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>

					<div className="grid grid-cols-2 gap-3">
						<MappedTextInput
							label="Blur"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={state}
							mapValue={(value) => value.childMixins?.shadow?.blur}
							onValueChange={(value) => {
								if (value != null && state._v.childMixins?.shadow != null) {
									state._v.childMixins.shadow.blur = value;
									state._notify();
								}
							}}
							disableFieldInheritance
						/>
						<MappedTextInput
							label="Spread"
							type="number"
							autoComplete="off"
							min={-48}
							max={48}
							step={4}
							state={state}
							mapValue={(value) => value.childMixins?.shadow?.spread}
							onValueChange={(value) => {
								if (value != null && state._v.childMixins?.shadow != null) {
									state._v.childMixins.shadow.spread = value;
									state._notify();
								}
							}}
							disableFieldInheritance
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<MappedTextInput
							label="Offset X"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={state}
							mapValue={(value) => value.childMixins?.shadow?.offsetX}
							onValueChange={(value) => {
								if (value != null && state._v.childMixins?.shadow != null) {
									state._v.childMixins.shadow.offsetX = value;
									state._notify();
								}
							}}
							disableFieldInheritance
						/>
						<MappedTextInput
							label="Offset Y"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={state}
							mapValue={(value) => value.childMixins?.shadow?.offsetY}
							onValueChange={(value) => {
								if (value != null && state._v.childMixins?.shadow != null) {
									state._v.childMixins.shadow.offsetY = value;
									state._notify();
								}
							}}
							disableFieldInheritance
						/>
					</div>
				</div>
			)}
		</div>
	);
};

interface TChildShadowStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TShadowStyleMixin>]> }, any>;
}

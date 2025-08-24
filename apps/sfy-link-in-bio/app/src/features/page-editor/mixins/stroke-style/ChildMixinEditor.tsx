import { TMergeMixins, TStrokeStyleMixin, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { MappedColorInput, MappedTextInput, MinusIcon, PlusIcon } from '@/components';

export const ChildStrokeStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildStrokeStyleMixinEditorProps<GValue>
) => {
	const { state: state } = props;

	const currentStroke = useCompute(state, ({ value }) => {
		return value.childMixins?.stroke;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		state._v.childMixins.stroke = {
			color: { r: 0, g: 0, b: 0, a: 1 },
			width: 1
		};
		state._notify();
	}, [state]);

	const handleRemoveStroke = React.useCallback(() => {
		state._v.childMixins.stroke = null;
		state._notify();
	}, [state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Stroke
				</Text>

				{/* Add/Remove stroke buttons */}
				{currentStroke != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveStroke} variant="plain" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddStroke} variant="plain" />
				)}
			</div>

			{currentStroke != null && (
				<div className="grid grid-cols-2 gap-3">
					<MappedColorInput
						label="Color"
						autoComplete="off"
						state={state}
						mapValue={(value) => value.childMixins?.stroke?.color}
						onValueChange={(value) => {
							if (value != null && state._v.childMixins?.stroke != null) {
								state._v.childMixins.stroke.color = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
					<MappedTextInput
						label="Width"
						type="number"
						autoComplete="off"
						min={0}
						max={20}
						step={1}
						state={state}
						mapValue={(value) => value.childMixins?.stroke?.width}
						onValueChange={(value) => {
							if (value != null && state._v.childMixins?.stroke != null) {
								state._v.childMixins.stroke.width = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
				</div>
			)}
		</div>
	);
};

interface TChildStrokeStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TStrokeStyleMixin>]> }, any>;
}

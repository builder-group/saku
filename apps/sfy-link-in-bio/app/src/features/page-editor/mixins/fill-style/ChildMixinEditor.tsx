import { TFillStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { MappedPaintInput, MinusIcon, PlusIcon } from '@/components';
import { TTokenPaintInputPaintType } from '../../components';
import { TPageEditor } from '../../lib';

export const ChildFillStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildFillStyleMixinEditorProps<GValue>
) => {
	const { state, editor, allowedPaintTypes } = props;

	const currentFill = useCompute(state, ({ value }) => {
		return value.childMixins?.fill;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		state._v.childMixins.fill = {
			paint: {
				type: 'solid',
				color: { r: 255, g: 255, b: 255, a: 1 }
			},
			opacity: 1
		};
		state._notify();
	}, [state]);

	const handleRemoveFill = React.useCallback(() => {
		state._v.childMixins.fill = null;
		state._notify();
	}, [state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Fill
				</Text>

				{/* Add/Remove fill buttons */}
				{currentFill != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveFill} variant="plain" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddFill} variant="plain" />
				)}
			</div>

			{currentFill != null && (
				<div>
					<MappedPaintInput
						label="Paint"
						autoComplete="off"
						state={state}
						mapValue={(value) => value.childMixins?.fill?.paint}
						onValueChange={(value) => {
							if (value != null && state._v.childMixins?.fill != null) {
								state._v.childMixins.fill.paint = value;
								state._notify();
							}
						}}
						disableFieldInheritance
						editor={editor}
						allowedPaintTypes={allowedPaintTypes}
					/>
				</div>
			)}
		</div>
	);
};

interface TChildFillStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TFillStyleMixin>]> }, any>;
	editor: TPageEditor;
	allowedPaintTypes?: TTokenPaintInputPaintType[];
}

import { TFlatNode, TMergeMixins, TStrokeStyleMixin, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { MappedColorInput, MappedTextInput, MinusIcon, PlusIcon } from '@/components';
import { TNodeState } from '../../lib';

export const ChildStrokeStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildStrokeStyleMixinEditorProps<GNode>
) => {
	const { nodeState } = props;

	const currentStroke = useCompute(nodeState, ({ value }) => {
		return value.childMixins?.stroke;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		nodeState._v.childMixins.stroke = {
			color: { r: 0, g: 0, b: 0, a: 1 },
			width: 1
		};
		nodeState._notify();
	}, [nodeState]);

	const handleRemoveStroke = React.useCallback(() => {
		nodeState._v.childMixins.stroke = null;
		nodeState._notify();
	}, [nodeState]);

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
						state={nodeState}
						mapValue={(value) => value.childMixins?.stroke?.color}
						onValueChange={(value) => {
							if (value != null && nodeState._v.childMixins?.stroke != null) {
								nodeState._v.childMixins.stroke.color = value;
								nodeState._notify();
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
						state={nodeState}
						mapValue={(value) => value.childMixins?.stroke?.width}
						onValueChange={(value) => {
							if (value != null && nodeState._v.childMixins?.stroke != null) {
								nodeState._v.childMixins.stroke.width = value;
								nodeState._notify();
							}
						}}
						disableFieldInheritance
					/>
				</div>
			)}
		</div>
	);
};

interface TChildStrokeStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<GNode & { childMixins: TMergeMixins<[TUnreference<TStrokeStyleMixin>]> }>;
}

import { TFillStyleMixin, TFlatNode, TMergeMixins, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { MappedPaintInput, MappedTextInput, MinusIcon, PlusIcon } from '@/components';
import { TNodeState } from '../../lib';

export const ChildFillStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildFillStyleMixinEditorProps<GNode>
) => {
	const { nodeState } = props;

	const currentFill = useCompute(nodeState, ({ value }) => {
		return value.childMixins?.fill;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		nodeState._v.childMixins.fill = {
			paint: {
				type: 'solid',
				color: { r: 255, g: 255, b: 255, a: 1 }
			},
			opacity: 1
		};
		nodeState._notify();
	}, [nodeState]);

	const handleRemoveFill = React.useCallback(() => {
		nodeState._v.childMixins.fill = null;
		nodeState._notify();
	}, [nodeState]);

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
				<div className="grid grid-cols-3 gap-3">
					<MappedPaintInput
						label="Paint"
						autoComplete="off"
						className="col-span-2"
						state={nodeState}
						mapValue={(value) => value.childMixins?.fill?.paint}
						onValueChange={(value) => {
							if (value != null && nodeState._v.childMixins?.fill != null) {
								nodeState._v.childMixins.fill.paint = value;
								nodeState._notify();
							}
						}}
						disableFieldInheritance
					/>
					<MappedTextInput
						label="Opacity"
						type="number"
						autoComplete="off"
						min={0}
						max={1}
						step={0.05}
						className="col-span-1"
						state={nodeState}
						mapValue={(value) => value.childMixins?.fill?.opacity}
						onValueChange={(value) => {
							if (value != null && nodeState._v.childMixins?.fill != null) {
								nodeState._v.childMixins.fill.opacity = value;
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

interface TChildFillStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<GNode & { childMixins: TMergeMixins<[TUnreference<TFillStyleMixin>]> }>;
}

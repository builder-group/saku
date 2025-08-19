import { TFlatNode, TMergeMixins, TShadowStyleMixin, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { MappedColorInput, MappedTextInput, MinusIcon, PlusIcon } from '@/components';
import { TNodeState } from '../../lib';

export const ChildShadowStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildShadowStyleMixinEditorProps<GNode>
) => {
	const { nodeState } = props;

	const currentShadow = useCompute(nodeState, ({ value }) => {
		return value.childMixins?.shadow;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddShadow = React.useCallback(() => {
		nodeState._v.childMixins.shadow = {
			color: { r: 0, g: 0, b: 0, a: 0.3 },
			offsetX: 0,
			offsetY: 2,
			blur: 4,
			spread: 0
		};
		nodeState._notify();
	}, [nodeState]);

	const handleRemoveShadow = React.useCallback(() => {
		nodeState._v.childMixins.shadow = null;
		nodeState._notify();
	}, [nodeState]);

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
						state={nodeState}
						mapValue={(value) => value.childMixins?.shadow?.color}
						onValueChange={(value) => {
							if (value != null && nodeState._v.childMixins?.shadow != null) {
								nodeState._v.childMixins.shadow.color = value;
								nodeState._notify();
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
							state={nodeState}
							mapValue={(value) => value.childMixins?.shadow?.blur}
							onValueChange={(value) => {
								if (value != null && nodeState._v.childMixins?.shadow != null) {
									nodeState._v.childMixins.shadow.blur = value;
									nodeState._notify();
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
							state={nodeState}
							mapValue={(value) => value.childMixins?.shadow?.spread}
							onValueChange={(value) => {
								if (value != null && nodeState._v.childMixins?.shadow != null) {
									nodeState._v.childMixins.shadow.spread = value;
									nodeState._notify();
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
							state={nodeState}
							mapValue={(value) => value.childMixins?.shadow?.offsetX}
							onValueChange={(value) => {
								if (value != null && nodeState._v.childMixins?.shadow != null) {
									nodeState._v.childMixins.shadow.offsetX = value;
									nodeState._notify();
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
							state={nodeState}
							mapValue={(value) => value.childMixins?.shadow?.offsetY}
							onValueChange={(value) => {
								if (value != null && nodeState._v.childMixins?.shadow != null) {
									nodeState._v.childMixins.shadow.offsetY = value;
									nodeState._notify();
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

interface TChildShadowStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<GNode & { childMixins: TMergeMixins<[TUnreference<TShadowStyleMixin>]> }>;
}

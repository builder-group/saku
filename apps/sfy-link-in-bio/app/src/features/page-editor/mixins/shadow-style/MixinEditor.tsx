import { deepCopy } from '@blgc/utils';
import {
	inherit,
	isInherited,
	resolveReference,
	TFlatNode,
	TMergeMixins,
	TShadowStyleMixin,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react';
import { createState } from 'feature-state';
import React from 'react';
import {
	LinkIcon,
	LinkOffIcon,
	MappedColorInput,
	MappedTextInput,
	MinusIcon,
	PlusIcon
} from '@/components';
import { useMapReferenceToProperty } from '../../hooks';
import { TNodeState } from '../../lib';

export const ShadowStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TShadowStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

	const resolvedShadow = useCombinedCompute(
		[nodeState, parentNodeState ?? createState(undefined)],
		([{ value: nodeValue }, { value: parentValue }]) => {
			return resolveReference(nodeValue.shadow, parentValue?.childMixins?.shadow);
		}
	);

	const isInheritedShadow = useCompute(nodeState, ({ value }) => {
		return isInherited(value.shadow);
	});

	const colorState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.shadow,
		propertyReference: (value) => value?.color,
		updateProperty: (value) => {
			if (nodeState._v.shadow != null && !isInherited(nodeState._v.shadow)) {
				nodeState._v.shadow.color = value;
				nodeState._notify();
			}
		}
	});
	const blurState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.shadow,
		propertyReference: (value) => value?.blur,
		updateProperty: (value) => {
			if (nodeState._v.shadow != null && !isInherited(nodeState._v.shadow)) {
				nodeState._v.shadow.blur = value;
				nodeState._notify();
			}
		}
	});
	const spreadState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.shadow,
		propertyReference: (value) => value?.spread,
		updateProperty: (value) => {
			if (nodeState._v.shadow != null && !isInherited(nodeState._v.shadow)) {
				nodeState._v.shadow.spread = value;
				nodeState._notify();
			}
		}
	});
	const offsetXState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.shadow,
		propertyReference: (value) => value?.offsetX,
		updateProperty: (value) => {
			if (nodeState._v.shadow != null && !isInherited(nodeState._v.shadow)) {
				nodeState._v.shadow.offsetX = value;
				nodeState._notify();
			}
		}
	});
	const offsetYState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.shadow,
		propertyReference: (value) => value?.offsetY,
		updateProperty: (value) => {
			if (nodeState._v.shadow != null && !isInherited(nodeState._v.shadow)) {
				nodeState._v.shadow.offsetY = value;
				nodeState._notify();
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddShadow = React.useCallback(() => {
		const parentShadow = parentNodeState?._v.childMixins?.shadow;
		nodeState._v.shadow = parentShadow ?? {
			color: { r: 0, g: 0, b: 0, a: 0.3 },
			offsetX: 0,
			offsetY: 2,
			blur: 4,
			spread: 0
		};
		nodeState._notify();
	}, [nodeState, parentNodeState]);

	const handleRemoveShadow = React.useCallback(() => {
		nodeState._v.shadow = null;
		nodeState._notify();
	}, [nodeState]);

	const handleToggleInheritance = React.useCallback(() => {
		nodeState._v.shadow = isInheritedShadow
			? (deepCopy(parentNodeState?._v.childMixins?.shadow) ?? null)
			: inherit();
		nodeState._notify();
	}, [isInheritedShadow, parentNodeState, nodeState]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{/* Mixin-level inheritance button */}
					{parentNodeState != null && (
						<button
							type="button"
							onClick={handleToggleInheritance}
							className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
							title={isInheritedShadow ? 'Unlink from parent' : 'Link to parent'}
						>
							{isInheritedShadow ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<Text as="span" variant="headingXs" tone="subdued">
						Shadow {isInheritedShadow ? '(Inherited)' : ''}
					</Text>
				</div>

				{/* Add/Remove shadow buttons */}
				{resolvedShadow != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveShadow} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddShadow} variant="plain" size="micro" />
				)}
			</div>

			{resolvedShadow != null && (
				<div className="space-y-3">
					<MappedColorInput
						label="Color"
						autoComplete="off"
						state={colorState}
						parentState={parentNodeState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							colorState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.shadow?.color}
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
							state={blurState}
							parentState={parentNodeState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								blurState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.blur}
							disableFieldInheritance
						/>
						<MappedTextInput
							label="Spread"
							type="number"
							autoComplete="off"
							min={-48}
							max={48}
							step={4}
							state={spreadState}
							parentState={parentNodeState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								spreadState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.spread}
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
							state={offsetXState}
							parentState={parentNodeState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								offsetXState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.offsetX}
							disableFieldInheritance
						/>
						<MappedTextInput
							label="Offset Y"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={offsetYState}
							parentState={parentNodeState}
							mapValue={(value) => value}
							onValueChange={(value) => {
								offsetYState.set(value);
							}}
							mapParentValue={(parent) => parent.childMixins?.shadow?.offsetY}
							disableFieldInheritance
						/>
					</div>
				</div>
			)}
		</div>
	);
};

interface TShadowStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TShadowStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TShadowStyleMixin>]>;
		}
	>;
}

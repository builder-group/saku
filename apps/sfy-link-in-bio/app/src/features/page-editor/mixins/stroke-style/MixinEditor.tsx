import { deepCopy } from '@blgc/utils';
import {
	inherit,
	isInherited,
	resolveReference,
	TFlatNode,
	TMergeMixins,
	TStrokeStyleMixin,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react';
import { createState } from 'feature-state';
import React from 'react';
import {
	Badge,
	InheritanceActionOverlay,
	LinkIcon,
	LinkOffIcon,
	MappedColorInput,
	MappedTextInput,
	MinusIcon,
	PlusIcon
} from '@/components';
import { useMapReferenceToProperty } from '../../hooks';
import { TNodeState, TPageEditor } from '../../lib';

export const StrokeStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TStrokeStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState, editor } = props;

	const resolvedStroke = useCombinedCompute(
		[nodeState, parentNodeState ?? createState(undefined)],
		([{ value: nodeValue }, { value: parentValue }]) => {
			return resolveReference(nodeValue.stroke, parentValue?.childMixins?.stroke);
		}
	);

	const isInheritedStroke = useCompute(nodeState, ({ value }) => {
		return isInherited(value.stroke);
	});

	const colorState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.stroke,
		propertyReference: (value) => value?.color,
		updateProperty: (value) => {
			if (nodeState._v.stroke != null && !isInherited(nodeState._v.stroke)) {
				nodeState._v.stroke.color = value;
				nodeState._notify();
			}
		}
	});
	const widthState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.stroke,
		propertyReference: (value) => value?.width,
		updateProperty: (value) => {
			if (nodeState._v.stroke != null && !isInherited(nodeState._v.stroke)) {
				nodeState._v.stroke.width = value;
				nodeState._notify();
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		const parentStroke = parentNodeState?._v.childMixins?.stroke;
		nodeState._v.stroke = parentStroke ?? {
			color: { r: 0, g: 0, b: 0, a: 1 },
			width: 1
		};
		nodeState._notify();
	}, [nodeState, parentNodeState]);

	const handleRemoveStroke = React.useCallback(() => {
		nodeState._v.stroke = null;
		nodeState._notify();
	}, [nodeState]);

	const handleToggleInheritance = React.useCallback(() => {
		nodeState._v.stroke = isInheritedStroke
			? (deepCopy(parentNodeState?._v.childMixins?.stroke) ?? null)
			: inherit();
		nodeState._notify();
	}, [isInheritedStroke, parentNodeState, nodeState]);

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
							title={isInheritedStroke ? 'Unlink from parent' : 'Link to parent'}
						>
							{isInheritedStroke ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Stroke
						</Text>
						{isInheritedStroke && (
							<Badge className="group relative hover:w-32">
								Inherited
								<InheritanceActionOverlay
									variant={'full-overlay'}
									onUnlink={handleToggleInheritance}
									onNavigateToParent={() => editor.switchView('settings')}
								/>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove stroke buttons */}
				{resolvedStroke != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveStroke} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddStroke} variant="plain" size="micro" />
				)}
			</div>

			{resolvedStroke != null && (
				<div className="grid grid-cols-2 gap-3">
					<MappedColorInput
						label="Color"
						autoComplete="off"
						state={colorState}
						parentState={parentNodeState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							colorState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.stroke?.color}
						onInheritChange={() => {
							handleToggleInheritance();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
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
						state={widthState}
						parentState={parentNodeState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							widthState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.stroke?.width}
						onInheritChange={() => {
							handleToggleInheritance();
						}}
						onNavigateToParent={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance
					/>
				</div>
			)}
		</div>
	);
};

interface TStrokeStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TStrokeStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TStrokeStyleMixin>]>;
		}
	>;
	editor: TPageEditor;
}

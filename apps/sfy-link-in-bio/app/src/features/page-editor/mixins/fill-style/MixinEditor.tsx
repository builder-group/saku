import { deepCopy } from '@blgc/utils';
import {
	inherit,
	isInherited,
	resolveReference,
	TFillStyleMixin,
	TFlatNode,
	TMergeMixins,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { ArrowRightIcon } from '@shopify/polaris-icons';
import { useCombinedCompute, useCompute } from 'feature-react';
import { createState } from 'feature-state';
import React from 'react';
import { Badge, LinkIcon, LinkOffIcon, MappedPaintInput, MinusIcon, PlusIcon } from '@/components';
import { useMapReferenceToProperty } from '../../hooks';
import { TNodeState, TPageEditor } from '../../lib';

export const FillStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TFillStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState, editor } = props;

	const resolvedFill = useCombinedCompute(
		[nodeState, parentNodeState ?? createState(undefined)],
		([{ value: nodeValue }, { value: parentValue }]) => {
			return resolveReference(nodeValue.fill, parentValue?.childMixins?.fill);
		}
	);

	const isInheritedFill = useCompute(nodeState, ({ value }) => {
		return isInherited(value.fill);
	});

	const paintState = useMapReferenceToProperty(nodeState, {
		topLevelReference: (value) => value.fill,
		propertyReference: (value) => value?.paint,
		updateProperty: (value) => {
			if (nodeState._v.fill != null && !isInherited(nodeState._v.fill)) {
				nodeState._v.fill.paint = value;
				nodeState._notify();
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		const parentFill = parentNodeState?._v.childMixins?.fill;
		nodeState._v.fill = parentFill ?? {
			paint: {
				type: 'solid',
				color: { r: 255, g: 255, b: 255, a: 1 }
			},
			opacity: 1
		};
		nodeState._notify();
	}, [nodeState, parentNodeState]);

	const handleRemoveFill = React.useCallback(() => {
		nodeState._v.fill = null;
		nodeState._notify();
	}, [nodeState]);

	const handleToggleInheritance = React.useCallback(() => {
		nodeState._v.fill = isInheritedFill
			? (deepCopy(parentNodeState?._v.childMixins?.fill) ?? null)
			: inherit();
		nodeState._notify();
	}, [isInheritedFill, parentNodeState, nodeState]);

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
							title={isInheritedFill ? 'Unlink from parent' : 'Link to parent'}
						>
							{isInheritedFill ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Fill
						</Text>
						{isInheritedFill && (
							<Badge asChild>
								<button
									type="button"
									onClick={() => editor.switchView('settings')}
									className="group pointer-events-auto cursor-pointer"
								>
									Inherited
									<ArrowRightIcon className="hidden h-3 w-3 group-hover:block" />
								</button>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove fill buttons */}
				{resolvedFill != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveFill} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddFill} variant="plain" size="micro" />
				)}
			</div>

			{resolvedFill != null && (
				<div>
					<MappedPaintInput
						label="Paint"
						autoComplete="off"
						state={paintState}
						parentState={parentNodeState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							paintState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.fill?.paint}
						onInheritedBadgeClick={() => {
							editor.switchView('settings');
						}}
						disableFieldInheritance
						editor={editor}
					/>
				</div>
			)}
		</div>
	);
};

interface TFillStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TFillStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TFillStyleMixin>]>;
		}
	>;
	editor: TPageEditor;
}

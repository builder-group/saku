import {
	inherit,
	isInherited,
	resolveReference,
	TFillStyleMixin,
	TFlatNode,
	TMergeMixins,
	TPaint,
	TReference,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react';
import { createState } from 'feature-state';
import React from 'react';
import { MappedTextField, MinusIcon, PlusIcon } from '@/components';
import { useMemoCleanup } from '@/hooks';
import { PaintStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const FillStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TFillStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

	const resolvedFill = useCombinedCompute(
		[nodeState, parentNodeState ?? createState(undefined)],
		([{ value: nodeValue }, { value: parentValue }]) => {
			return resolveReference(nodeValue.fill, parentValue?.childMixins?.fill);
		}
	);

	const isInheritedFill = useCompute(nodeState, ({ value }) => {
		return isInherited(value.fill);
	});

	const opacityState = useMemoCleanup(() => {
		const state = createState<TReference<number> | undefined>(undefined);
		const unsubscribeNodeState = nodeState.subscribe(({ value }) => {
			if (isInherited(value.fill)) {
				state.set(inherit());
			} else {
				state.set(value.fill?.opacity);
			}
		});
		return [state, unsubscribeNodeState];
	}, [nodeState]);

	const handleAddFill = React.useCallback(() => {
		nodeState._v.fill = {
			paint: {
				type: 'solid',
				color: { r: 255, g: 255, b: 255, a: 1 }
			},
			opacity: 1
		};
		nodeState._notify();
	}, [nodeState]);

	const handleRemoveFill = React.useCallback(() => {
		nodeState._v.fill = null;
		nodeState._notify();
	}, [nodeState]);

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Fill
				</Text>
				{resolvedFill != null ? (
					<Button icon={MinusIcon} onClick={handleRemoveFill} variant="plain" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddFill} variant="plain" />
				)}
			</div>

			{resolvedFill != null && (
				<div className="grid grid-cols-3 gap-3">
					<PaintStyleField
						label="Color"
						node={nodeState}
						nodeValueMapper={(value) => {
							const fill = value.fill;
							if (fill != null && !isInherited(fill)) {
								return fill.paint;
							}
							return undefined;
						}}
						nodeValueSetter={(node, value) => {
							if (value != null && node._v.fill != null && !isInherited(node._v.fill)) {
								node._v.fill.paint = value as TPaint;
								node._notify();
							}
						}}
						autoComplete="off"
						className="col-span-2"
					/>

					<MappedTextField
						label="Opacity"
						state={opacityState}
						parentState={parentNodeState}
						mapValue={(value) => value}
						onValueChange={(value) => {
							opacityState.set(value);
						}}
						mapParentValue={(parent) => parent.childMixins?.fill?.opacity}
						onInheritChange={(shouldInherit, parentValue) => {
							if (shouldInherit) {
								opacityState.set(inherit());
							} else {
								opacityState.set(parentValue ?? 1);
							}
						}}
						type="number"
						autoComplete="off"
						min={0}
						max={1}
						step={0.01}
						className="col-span-1"
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
}

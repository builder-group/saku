import {
	isInherited,
	resolveReference,
	TFillStyleMixin,
	TFlatNode,
	TMergeMixins,
	TPaint,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { MinusIcon, PlusIcon } from '@/components';
import { PaintStyleField, TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const FillStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TFillStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

	const resolvedFill = useCompute(nodeState, ({ value }) => {
		return resolveReference(value.fill, parentNodeState?._v.childMixins?.fill);
	});

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

					<TextStyleField
						label="Opacity"
						node={nodeState}
						nodeValueMapper={(value) => {
							const fill = value.fill;
							if (fill != null && !isInherited(fill)) {
								return fill.opacity;
							}
							return undefined;
						}}
						nodeValueSetter={(node, value) => {
							if (node._v.fill != null && !isInherited(node._v.fill)) {
								node._v.fill.opacity = value as number;
							}
							node._notify();
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

import {
	isInherited,
	resolveReference,
	TFillStyleMixin,
	TFlatNode,
	TMergeMixins,
	TRgba,
	TSolidPaint,
	TUnreference
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { ColorStyleField, TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const FillStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TFillStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

	// Get the resolved fill value for display
	const resolvedFill = React.useMemo(() => {
		const currentFill = nodeState._v.fill;
		if (currentFill == null || isInherited(currentFill)) {
			return undefined;
		}
		return resolveReference(currentFill, parentNodeState?._v.childMixins?.fill);
	}, [nodeState._v.fill, parentNodeState]);

	const handleAddFill = React.useCallback(() => {
		const defaultFill: TSolidPaint = {
			type: 'solid',
			color: { r: 0, g: 0, b: 0, a: 1 }
		};

		nodeState._v.fill = {
			paint: defaultFill,
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
					<Button size="slim" tone="critical" onClick={handleRemoveFill} aria-label="Remove fill">
						−
					</Button>
				) : (
					<Button size="slim" tone="success" onClick={handleAddFill} aria-label="Add fill">
						+
					</Button>
				)}
			</div>

			{resolvedFill != null && (
				<div className="space-y-3">
					<ColorStyleField
						label="Color"
						node={nodeState}
						nodeValueMapper={(value) => {
							const fill = value.fill;
							if (fill != null && !isInherited(fill) && fill.paint.type === 'solid') {
								return fill.paint.color;
							}
							return undefined;
						}}
						nodeValueSetter={(node, value) => {
							if (value != null && node._v.fill != null && !isInherited(node._v.fill)) {
								if (node._v.fill.paint.type === 'solid') {
									node._v.fill.paint.color = value as TRgba;
									node._notify();
								}
							}
						}}
						autoComplete="off"
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
								node._notify();
							}
						}}
						type="number"
						autoComplete="off"
						min={0}
						max={1}
						step={0.01}
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

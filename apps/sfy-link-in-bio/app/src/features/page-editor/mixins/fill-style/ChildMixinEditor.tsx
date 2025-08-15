import { TFillStyleMixin, TFlatNode, TMergeMixins, TRgba, TUnreference } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { ColorStyleField, TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const ChildFillStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildFillStyleMixinEditorProps<GNode>
) => {
	const { nodeState } = props;

	const currentFill = React.useMemo(() => {
		return nodeState._v.childMixins?.fill;
	}, [nodeState]);

	const handleAddFill = React.useCallback(() => {
		nodeState._v.childMixins.fill = {
			paint: {
				type: 'solid',
				color: { r: 0, g: 0, b: 0, a: 1 }
			},
			opacity: 1
		};
		nodeState._notify();
	}, [nodeState]);

	const handleRemoveFill = React.useCallback(() => {
		nodeState._v.childMixins.fill = null;
		nodeState._notify();
	}, [nodeState]);

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Fill
				</Text>
				{currentFill != null ? (
					<Button size="slim" tone="critical" onClick={handleRemoveFill} aria-label="Remove fill">
						−
					</Button>
				) : (
					<Button size="slim" tone="success" onClick={handleAddFill} aria-label="Add fill">
						+
					</Button>
				)}
			</div>

			{currentFill != null && (
				<div className="space-y-3">
					<ColorStyleField
						label="Color"
						node={nodeState}
						nodeValueMapper={(value) => {
							const fill = value.childMixins?.fill;
							if (fill != null && fill.paint.type === 'solid') {
								return fill.paint.color;
							}
							return undefined;
						}}
						nodeValueSetter={(node, value) => {
							if (
								value != null &&
								node._v.childMixins?.fill != null &&
								node._v.childMixins.fill.paint.type === 'solid'
							) {
								node._v.childMixins.fill.paint.color = value as TRgba;
								node._notify();
							}
						}}
						autoComplete="off"
					/>

					<TextStyleField
						label="Opacity"
						node={nodeState}
						nodeValueMapper={(value) => {
							const fill = value.childMixins?.fill;
							if (fill != null) {
								return fill.opacity;
							}
							return undefined;
						}}
						nodeValueSetter={(node, value) => {
							if (node._v.childMixins?.fill != null) {
								node._v.childMixins.fill.opacity = value as number;
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

interface TChildFillStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<GNode & { childMixins: TMergeMixins<[TUnreference<TFillStyleMixin>]> }>;
}

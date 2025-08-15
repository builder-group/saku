import { TFlatNode, TLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const ChildLayoutStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildLayoutStyleMixinEditorProps<GNode>
) => {
	const { nodeState } = props;

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Layout
				</Text>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<TextStyleField
					label="Padding"
					node={nodeState}
					nodeValueMapper={(value) => value.childMixins?.layout?.padding}
					nodeValueSetter={(node, value) => {
						node._v.childMixins.layout.padding = value as number;
						node._notify();
					}}
					type="number"
					autoComplete="off"
					min={0}
					max={100}
				/>
			</div>
		</div>
	);
};

interface TChildLayoutStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<GNode & { childMixins: TMergeMixins<[TUnreference<TLayoutStyleMixin>]> }>;
}

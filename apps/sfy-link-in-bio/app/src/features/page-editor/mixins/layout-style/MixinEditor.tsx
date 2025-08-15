import { TFlatNode, TLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const LayoutStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TLayoutStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

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
					parentNode={parentNodeState}
					nodeValueMapper={(value) => value.layout.padding}
					nodeValueSetter={(node, value) => {
						node._v.layout.padding = value;
						node._notify();
					}}
					parentValueMapper={(parent) => parent?.childMixins?.layout?.padding}
					type="number"
					autoComplete="off"
					min={0}
					max={100}
				/>
			</div>
		</div>
	);
};

interface TLayoutStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TLayoutStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TLayoutStyleMixin>]>;
		}
	>;
}

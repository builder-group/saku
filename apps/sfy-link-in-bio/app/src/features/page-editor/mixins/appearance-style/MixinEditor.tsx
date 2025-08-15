import { TAppearanceStyleMixin, TFlatNode, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const AppearanceStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TAppearanceStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState } = props;

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Appearance
				</Text>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<TextStyleField
					label="Border Radius"
					node={nodeState}
					parentNode={parentNodeState}
					nodeValueMapper={(value) => value.appearance.borderRadius}
					nodeValueSetter={(node, value) => {
						node._v.appearance.borderRadius = value;
						node._notify();
					}}
					parentValueMapper={(parent) => parent?.childMixins?.appearance?.borderRadius}
					type="number"
					autoComplete="off"
					min={0}
					max={999}
				/>
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<GNode extends TFlatNode, GParentNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TAppearanceStyleMixin]>>;
	parentNodeState?: TNodeState<
		GParentNode & {
			childMixins: TMergeMixins<[TUnreference<TAppearanceStyleMixin>]>;
		}
	>;
}

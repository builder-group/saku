import { TAppearanceStyleMixin, TFlatNode, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TextStyleField } from '../../components';
import { TNodeState } from '../../lib';

export const ChildAppearanceStyleMixinEditor = <GNode extends TFlatNode>(
	props: TChildAppearanceStyleMixinEditorProps<GNode>
) => {
	const { nodeState } = props;

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
					nodeValueMapper={(value) => value.childMixins?.appearance?.borderRadius}
					nodeValueSetter={(node, value) => {
						node._v.childMixins.appearance.borderRadius = value as number;
						node._notify();
					}}
					type="number"
					autoComplete="off"
					min={0}
					max={999}
				/>
			</div>
		</div>
	);
};

interface TChildAppearanceStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<
		GNode & { childMixins: TMergeMixins<[TUnreference<TAppearanceStyleMixin>]> }
	>;
}

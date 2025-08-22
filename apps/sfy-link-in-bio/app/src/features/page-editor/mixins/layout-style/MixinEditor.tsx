import { inherit, TFlatNode, TLayoutStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { MappedTextInput } from '@/components';
import { TNodeState, TPageEditor } from '../../lib';

export const LayoutStyleMixinEditor = <GNode extends TFlatNode, GParentNode extends TFlatNode>(
	props: TLayoutStyleMixinEditorProps<GNode, GParentNode>
) => {
	const { nodeState, parentNodeState, editor } = props;

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Layout
				</Text>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<MappedTextInput
					label="Padding"
					type="number"
					autoComplete="off"
					min={0}
					max={96}
					step={4}
					state={nodeState}
					parentState={parentNodeState}
					mapValue={(value) => value.layout.padding}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.layout.padding = value;
							nodeState._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins?.layout?.padding}
					onInheritChange={(shouldInherit, parentValue) => {
						nodeState._v.layout.padding = shouldInherit ? inherit() : (parentValue as number);
						nodeState._notify();
					}}
					onNavigateToParent={() => {
						editor.switchView('settings');
					}}
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
	editor: TPageEditor;
}

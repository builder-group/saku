import {
	inherit,
	TAppearanceStyleMixin,
	TFlatNode,
	TMergeMixins,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { MappedTextField } from '@/components';
import { ToggleStyleField } from '../../components';
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
				<MappedTextField
					label="Opacity"
					state={nodeState}
					parentState={parentNodeState}
					mapValue={(value) => value.appearance.opacity}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.appearance.opacity = value;
							nodeState._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins.appearance.opacity}
					onInheritChange={(shouldInherit, parentValue) => {
						if (shouldInherit) {
							nodeState._v.appearance.opacity = inherit();
						} else {
							nodeState._v.appearance.opacity = parentValue ?? 100;
						}
						nodeState._notify();
					}}
					type="number"
					autoComplete="off"
					min={0}
					max={100}
				/>
				<MappedTextField
					label="Border Radius"
					state={nodeState}
					parentState={parentNodeState}
					mapValue={(value) => value.appearance.borderRadius}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.appearance.borderRadius = value;
							nodeState._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins.appearance.borderRadius}
					onInheritChange={(shouldInherit, parentValue) => {
						if (shouldInherit) {
							nodeState._v.appearance.borderRadius = inherit();
						} else {
							nodeState._v.appearance.borderRadius = parentValue ?? 0;
						}
						nodeState._notify();
					}}
					type="number"
					autoComplete="off"
					min={0}
					max={999}
				/>
			</div>
			<div>
				<ToggleStyleField
					label="Visible"
					node={nodeState}
					parentNode={parentNodeState}
					nodeValueMapper={(value) => value.appearance.visible}
					nodeValueSetter={(node, value) => {
						node._v.appearance.visible = value;
						node._notify();
					}}
					parentValueMapper={(parent) => parent.childMixins.appearance.visible}
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

import {
	inherit,
	TAppearanceStyleMixin,
	TFlatNode,
	TMergeMixins,
	TReference,
	TUnreference
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { MappedTextInput, MappedToggleInput } from '@/components';
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
				<MappedTextInput
					label="Opacity"
					type="number"
					autoComplete="off"
					min={0}
					max={1}
					step={0.05}
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
						nodeState._v.appearance.opacity = shouldInherit
							? inherit()
							: (parentValue as TReference<number>);

						nodeState._notify();
					}}
					disableFieldInheritance={parentNodeState == null}
				/>
				<MappedTextInput
					label="Border Radius"
					type="number"
					autoComplete="off"
					min={0}
					max={999}
					step={2}
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
						nodeState._v.appearance.borderRadius = shouldInherit
							? inherit()
							: (parentValue as TReference<number>);
						nodeState._notify();
					}}
					disableFieldInheritance={parentNodeState == null}
				/>
			</div>
			<div>
				<MappedToggleInput
					label="Visible"
					state={nodeState}
					parentState={parentNodeState}
					mapValue={(value) => value.appearance.visible}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.appearance.visible = value;
							nodeState._notify();
						}
					}}
					mapParentValue={(parent) => parent.childMixins.appearance.visible}
					onInheritChange={(shouldInherit, parentValue) => {
						nodeState._v.appearance.visible = shouldInherit
							? inherit()
							: (parentValue as TReference<boolean>);
						nodeState._notify();
					}}
					disableFieldInheritance={parentNodeState == null}
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

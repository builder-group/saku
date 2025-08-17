import { TAppearanceStyleMixin, TFlatNode, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { MappedTextInput, MappedToggleInput } from '@/components';
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
				<MappedTextInput
					label="Opacity"
					type="number"
					autoComplete="off"
					min={0}
					max={1}
					step={0.05}
					state={nodeState}
					mapValue={(value) => value.childMixins?.appearance?.opacity}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.childMixins.appearance.opacity = value;
							nodeState._notify();
						}
					}}
					disableFieldInheritance
				/>
				<MappedTextInput
					label="Border Radius"
					type="number"
					autoComplete="off"
					min={0}
					max={999}
					step={2}
					state={nodeState}
					mapValue={(value) => value.childMixins?.appearance?.borderRadius}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.childMixins.appearance.borderRadius = value;
							nodeState._notify();
						}
					}}
					disableFieldInheritance
				/>
			</div>
			<div>
				<MappedToggleInput
					label="Visible"
					state={nodeState}
					mapValue={(value) => value.childMixins?.appearance?.visible}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.childMixins.appearance.visible = value;
							nodeState._notify();
						}
					}}
					disableFieldInheritance
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

import { TFlatNode, TMergeMixins, TPageLayoutStyleMixin } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { MappedTextInput } from '@/components';
import { TNodeState } from '../../lib';

export const PageLayoutStyleMixinEditor = <GNode extends TFlatNode>(
	props: TPageLayoutStyleMixinEditorProps<GNode>
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
				<MappedTextInput
					label="Spacing"
					type="number"
					autoComplete="off"
					min={0}
					max={96}
					step={4}
					state={nodeState}
					mapValue={(value) => value.layout.spacing}
					onValueChange={(value) => {
						if (value != null) {
							nodeState._v.layout.spacing = value;
							nodeState._notify();
						}
					}}
					disableFieldInheritance
				/>
			</div>
		</div>
	);
};

interface TPageLayoutStyleMixinEditorProps<GNode extends TFlatNode> {
	nodeState: TNodeState<GNode & TMergeMixins<[TPageLayoutStyleMixin]>>;
}

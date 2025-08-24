import { TMergeMixins, TPageStyleMixin } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { MappedTextInput } from '@/components';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { FillStyleMixinEditor } from '../fill-style';

export const PageStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TPageStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const fillState = useMapState(state, {
		get: (parent) => ({ fill: parent.page.fill }),
		set: (parent, child) => {
			parent._v.page.fill = child.fill;
			parent._notify();
		}
	});

	return (
		<>
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
						state={state}
						mapValue={(value) => value.page.layout.spacing}
						onValueChange={(value) => {
							if (value != null) {
								state._v.page.layout.spacing = value;
								state._notify();
							}
						}}
						disableFieldInheritance
					/>
				</div>
			</div>
			<div className="h-px bg-gray-200" />
			<FillStyleMixinEditor state={fillState} editor={editor} />
		</>
	);
};

interface TPageStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & TMergeMixins<[TPageStyleMixin]>, any>;
	editor: TPageEditor;
}

import { TButtonStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { ChildAppearanceStyleMixinEditor } from '../appearance-style';
import { ChildFillStyleMixinEditor } from '../fill-style';
import { ChildShadowStyleMixinEditor } from '../shadow-style';
import { ChildStrokeStyleMixinEditor } from '../stroke-style';
import { ChildTextStyleMixinEditor } from '../text-style';

export const ChildButtonStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildButtonStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const flatState = useMapState(state, {
		get: (parent) => ({ childMixins: parent.childMixins.button }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.button = child.childMixins;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<ChildAppearanceStyleMixinEditor state={flatState} />
			<div className="h-px bg-neutral-200" />
			<ChildFillStyleMixinEditor state={flatState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<ChildStrokeStyleMixinEditor state={flatState} />
			<div className="h-px bg-neutral-200" />
			<ChildShadowStyleMixinEditor state={flatState} />
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<ChildTextStyleMixinEditor state={flatState} editor={editor} />
		</>
	);
};

interface TChildButtonStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TButtonStyleMixin>]> }, any>;
	editor: TPageEditor;
}

import { TButtonStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TextStyleMixinEditor } from '../text-style';

export const ButtonStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TButtonStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const flatState = useMapState(state, {
		map: (parent) => parent.button,
		sync: (parent, child, notifyOptions) => {
			parent._v.button = child;
			parent._notify(notifyOptions);
		}
	});
	const flatParentState = useMapState(parentState, {
		map: (parent) => ({ childMixins: parent.childMixins.button }),
		sync: (parent, child, notifyOptions) => {
			parent._v.childMixins.button = child.childMixins;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor state={flatState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<TextStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
		</>
	);
};

interface TButtonStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TButtonStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TButtonStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

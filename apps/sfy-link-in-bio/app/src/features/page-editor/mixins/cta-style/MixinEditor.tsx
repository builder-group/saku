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

export const CtaStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TCtaStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const flatState = useMapState(state, {
		get: (parent) => parent.cta,
		set: (parent, child, notifyOptions) => {
			parent._v.cta = child;
			parent._notify(notifyOptions);
		}
	});
	const flatParentState = useMapState(parentState, {
		get: (parent) => ({ childMixins: parent.childMixins.cta }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta = child.childMixins;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<FillStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<StrokeStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ShadowStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<div>
				<Text as="span" variant="headingXl" tone="subdued">
					Text
				</Text>
			</div>
			<div className="h-px bg-gray-200" />
			<TextStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
		</>
	);
};

interface TCtaStyleMixinEditorProps<
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

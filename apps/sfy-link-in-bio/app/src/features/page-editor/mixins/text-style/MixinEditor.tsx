import { TMergeMixins, TTextStyleMixin, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';

export const TextStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TTextStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const flatState = useMapState(state, {
		map: (parent) => parent.text,
		sync: (parent, child, notifyOptions) => {
			parent._v.text = child;
			parent._notify(notifyOptions);
		}
	});
	const flatParentState = useMapState(parentState, {
		map: (parent) => ({ childMixins: parent.childMixins.text }),
		sync: (parent, child, notifyOptions) => {
			parent._v.childMixins.text = child.childMixins;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor state={flatState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<TypographyStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={flatState}
				parentState={flatParentState}
				editor={editor}
				allowedPaintTypes={['solid']}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor state={flatState} parentState={flatParentState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={flatState}
				parentState={flatParentState}
				editor={editor}
				disabledSpread
			/>
		</>
	);
};

interface TTextStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TTextStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TTextStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

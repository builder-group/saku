import { TCardStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { LayoutStyleMixinEditor } from '../layout-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';

export const CardStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TCardStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const layoutState = useMapState(state, {
		get: (parent) => ({ layout: parent.card.layout }),
		set: (parent, child) => {
			parent._v.card.layout = child.layout;
			parent._notify();
		}
	});
	const appearanceState = useMapState(state, {
		get: (parent) => ({ appearance: parent.card.appearance }),
		set: (parent, child) => {
			parent._v.card.appearance = child.appearance;
			parent._notify();
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ fill: parent.card.fill }),
		set: (parent, child) => {
			parent._v.card.fill = child.fill;
			parent._notify();
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ stroke: parent.card.stroke }),
		set: (parent, child) => {
			parent._v.card.stroke = child.stroke;
			parent._notify();
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ shadow: parent.card.shadow }),
		set: (parent, child) => {
			parent._v.card.shadow = child.shadow;
			parent._notify();
		}
	});

	const parentLayoutState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { layout: parent.childMixins.card.layout } }),
		set: (parent, child) => {
			parent._v.childMixins.card.layout = child.childMixins.layout;
			parent._notify();
		}
	});
	const parentAppearanceState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.card.appearance } }),
		set: (parent, child) => {
			parent._v.childMixins.card.appearance = child.childMixins.appearance;
			parent._notify();
		}
	});
	const parentFillState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.card.fill } }),
		set: (parent, child) => {
			parent._v.childMixins.card.fill = child.childMixins.fill;
			parent._notify();
		}
	});
	const parentStrokeState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.card.stroke } }),
		set: (parent, child) => {
			parent._v.childMixins.card.stroke = child.childMixins.stroke;
			parent._notify();
		}
	});
	const parentShadowState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.card.shadow } }),
		set: (parent, child) => {
			parent._v.childMixins.card.shadow = child.childMixins.shadow;
			parent._notify();
		}
	});

	return (
		<>
			<LayoutStyleMixinEditor state={layoutState} parentState={parentLayoutState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<AppearanceStyleMixinEditor
				state={appearanceState}
				parentState={parentAppearanceState}
				editor={editor}
			/>
			<div className="h-px bg-gray-200" />
			<FillStyleMixinEditor state={fillState} parentState={parentFillState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<StrokeStyleMixinEditor state={strokeState} parentState={parentStrokeState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ShadowStyleMixinEditor state={shadowState} parentState={parentShadowState} editor={editor} />
		</>
	);
};

interface TCardStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TCardStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TCardStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

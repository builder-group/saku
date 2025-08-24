import { TCtaStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';

export const CtaStyleMixinEditor = <
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
>(
	props: TCtaStyleMixinEditorProps<GValue, GParentValue>
) => {
	const { state, parentState, editor } = props;

	const appearanceState = useMapState(state, {
		get: (parent) => ({ appearance: parent.cta.appearance }),
		set: (parent, child) => {
			parent._v.cta.appearance = child.appearance;
			parent._notify();
		}
	});
	const typographyState = useMapState(state, {
		get: (parent) => ({ typography: parent.cta.typography }),
		set: (parent, child) => {
			parent._v.cta.typography = child.typography;
			parent._notify();
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ fill: parent.cta.fill }),
		set: (parent, child) => {
			parent._v.cta.fill = child.fill;
			parent._notify();
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ stroke: parent.cta.stroke }),
		set: (parent, child) => {
			parent._v.cta.stroke = child.stroke;
			parent._notify();
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ shadow: parent.cta.shadow }),
		set: (parent, child) => {
			parent._v.cta.shadow = child.shadow;
			parent._notify();
		}
	});

	const parentAppearanceState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.cta.appearance } }),
		set: (parent, child) => {
			parent._v.childMixins.cta.appearance = child.childMixins.appearance;
			parent._notify();
		}
	});
	const parentTypographyState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { typography: parent.childMixins.cta.typography } }),
		set: (parent, child) => {
			parent._v.childMixins.cta.typography = child.childMixins.typography;
			parent._notify();
		}
	});
	const parentFillState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.cta.fill } }),
		set: (parent, child) => {
			parent._v.childMixins.cta.fill = child.childMixins.fill;
			parent._notify();
		}
	});
	const parentStrokeState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.cta.stroke } }),
		set: (parent, child) => {
			parent._v.childMixins.cta.stroke = child.childMixins.stroke;
			parent._notify();
		}
	});
	const parentShadowState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.cta.shadow } }),
		set: (parent, child) => {
			parent._v.childMixins.cta.shadow = child.childMixins.shadow;
			parent._notify();
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor
				state={appearanceState}
				parentState={parentAppearanceState}
				editor={editor}
			/>
			<div className="h-px bg-gray-200" />
			<TypographyStyleMixinEditor
				state={typographyState}
				parentState={parentTypographyState}
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

interface TCtaStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GParentValue extends Record<string, any>
> {
	state: TState<GValue & TMergeMixins<[TCtaStyleMixin]>, any>;
	parentState?: TState<
		GParentValue & {
			childMixins: TMergeMixins<[TUnreference<TCtaStyleMixin>]>;
		},
		any
	>;
	editor: TPageEditor;
}

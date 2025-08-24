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

	const appearanceState = useMapState(state, {
		get: (parent) => ({ appearance: parent.text.appearance }),
		set: (parent, child, notifyOptions) => {
			parent._v.text.appearance = child.appearance;
			parent._notify(notifyOptions);
		}
	});
	const typographyState = useMapState(state, {
		get: (parent) => ({ typography: parent.text.typography }),
		set: (parent, child, notifyOptions) => {
			parent._v.text.typography = child.typography;
			parent._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ fill: parent.text.fill }),
		set: (parent, child, notifyOptions) => {
			parent._v.text.fill = child.fill;
			parent._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ stroke: parent.text.stroke }),
		set: (parent, child, notifyOptions) => {
			parent._v.text.stroke = child.stroke;
			parent._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ shadow: parent.text.shadow }),
		set: (parent, child, notifyOptions) => {
			parent._v.text.shadow = child.shadow;
			parent._notify(notifyOptions);
		}
	});

	const parentAppearanceState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.text.appearance } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.appearance = child.childMixins.appearance;
			parent._notify(notifyOptions);
		}
	});
	const parentTypographyState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { typography: parent.childMixins.text.typography } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.typography = child.childMixins.typography;
			parent._notify(notifyOptions);
		}
	});
	const parentFillState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.text.fill } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.fill = child.childMixins.fill;
			parent._notify(notifyOptions);
		}
	});
	const parentStrokeState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.text.stroke } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.stroke = child.childMixins.stroke;
			parent._notify(notifyOptions);
		}
	});
	const parentShadowState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.text.shadow } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.shadow = child.childMixins.shadow;
			parent._notify(notifyOptions);
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
			<FillStyleMixinEditor
				state={fillState}
				parentState={parentFillState}
				editor={editor}
				allowedPaintTypes={['solid']}
			/>
			<div className="h-px bg-gray-200" />
			<StrokeStyleMixinEditor state={strokeState} parentState={parentStrokeState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ShadowStyleMixinEditor state={shadowState} parentState={parentShadowState} editor={editor} />
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

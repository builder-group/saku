import { TCtaStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
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

	const appearanceState = useMapState(state, {
		get: (parent) => ({ appearance: parent.cta.appearance }),
		set: (parent, child, notifyOptions) => {
			parent._v.cta.appearance = child.appearance;
			parent._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ fill: parent.cta.fill }),
		set: (parent, child, notifyOptions) => {
			parent._v.cta.fill = child.fill;
			parent._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ stroke: parent.cta.stroke }),
		set: (parent, child, notifyOptions) => {
			parent._v.cta.stroke = child.stroke;
			parent._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ shadow: parent.cta.shadow }),
		set: (parent, child, notifyOptions) => {
			parent._v.cta.shadow = child.shadow;
			parent._notify(notifyOptions);
		}
	});
	const textState = useMapState(state, {
		get: (parent) => ({ text: parent.cta.text }),
		set: (parent, child, notifyOptions) => {
			parent._v.cta.text = child.text;
			parent._notify(notifyOptions);
		}
	});

	const parentAppearanceState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.cta.appearance } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.appearance = child.childMixins.appearance;
			parent._notify(notifyOptions);
		}
	});
	const parentFillState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.cta.fill } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.fill = child.childMixins.fill;
			parent._notify(notifyOptions);
		}
	});
	const parentStrokeState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.cta.stroke } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.stroke = child.childMixins.stroke;
			parent._notify(notifyOptions);
		}
	});
	const parentShadowState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.cta.shadow } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.shadow = child.childMixins.shadow;
			parent._notify(notifyOptions);
		}
	});
	const parentTextState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { text: parent.childMixins.cta.text } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.text = child.childMixins.text;
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
			<FillStyleMixinEditor state={fillState} parentState={parentFillState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<StrokeStyleMixinEditor state={strokeState} parentState={parentStrokeState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ShadowStyleMixinEditor state={shadowState} parentState={parentShadowState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<div>
				<Text as="span" variant="headingXl" tone="subdued">
					Text
				</Text>
			</div>
			<div className="h-px bg-gray-200" />
			<TextStyleMixinEditor state={textState} parentState={parentTextState} editor={editor} />
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

import { TMergeMixins, TTextStyleMixin, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { ChildAppearanceStyleMixinEditor } from '../appearance-style';
import { ChildFillStyleMixinEditor } from '../fill-style';
import { ChildShadowStyleMixinEditor } from '../shadow-style';
import { ChildStrokeStyleMixinEditor } from '../stroke-style';
import { ChildTypographyStyleMixinEditor } from '../typography-style';

export const ChildTextStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildTextStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const appearanceState = useMapState(state, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.text.appearance } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.appearance = child.childMixins.appearance;
			parent._notify(notifyOptions);
		}
	});
	const typographyState = useMapState(state, {
		get: (parent) => ({ childMixins: { typography: parent.childMixins.text.typography } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.typography = child.childMixins.typography;
			parent._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.text.fill } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.fill = child.childMixins.fill;
			parent._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.text.stroke } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.stroke = child.childMixins.stroke;
			parent._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.text.shadow } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.text.shadow = child.childMixins.shadow;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<ChildAppearanceStyleMixinEditor state={appearanceState} />
			<div className="h-px bg-gray-200" />
			<ChildTypographyStyleMixinEditor state={typographyState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ChildFillStyleMixinEditor state={fillState} editor={editor} allowedPaintTypes={['solid']} />
			<div className="h-px bg-gray-200" />
			<ChildStrokeStyleMixinEditor state={strokeState} />
			<div className="h-px bg-gray-200" />
			<ChildShadowStyleMixinEditor state={shadowState} />
		</>
	);
};

interface TChildTextStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TTextStyleMixin>]> }, any>;
	editor: TPageEditor;
}

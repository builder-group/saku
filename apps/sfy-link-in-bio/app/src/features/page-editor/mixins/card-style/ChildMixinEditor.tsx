import { TCardStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { ChildAppearanceStyleMixinEditor } from '../appearance-style';
import { ChildFillStyleMixinEditor } from '../fill-style';
import { ChildLayoutStyleMixinEditor } from '../layout-style';
import { ChildShadowStyleMixinEditor } from '../shadow-style';
import { ChildStrokeStyleMixinEditor } from '../stroke-style';

export const ChildCardStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildCardStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const layoutState = useMapState(state, {
		get: (parent) => ({ childMixins: { layout: parent.childMixins.card.layout } }),
		set: (parent, child) => {
			parent._v.childMixins.card.layout = child.childMixins.layout;
			parent._notify();
		}
	});
	const appearanceState = useMapState(state, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.card.appearance } }),
		set: (parent, child) => {
			parent._v.childMixins.card.appearance = child.childMixins.appearance;
			parent._notify();
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.card.fill } }),
		set: (parent, child) => {
			parent._v.childMixins.card.fill = child.childMixins.fill;
			parent._notify();
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.card.stroke } }),
		set: (parent, child) => {
			parent._v.childMixins.card.stroke = child.childMixins.stroke;
			parent._notify();
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.card.shadow } }),
		set: (parent, child) => {
			parent._v.childMixins.card.shadow = child.childMixins.shadow;
			parent._notify();
		}
	});

	return (
		<>
			<ChildLayoutStyleMixinEditor state={layoutState} />
			<div className="h-px bg-gray-200" />
			<ChildAppearanceStyleMixinEditor state={appearanceState} />
			<div className="h-px bg-gray-200" />
			<ChildFillStyleMixinEditor state={fillState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ChildStrokeStyleMixinEditor state={strokeState} />
			<div className="h-px bg-gray-200" />
			<ChildShadowStyleMixinEditor state={shadowState} />
		</>
	);
};

interface TChildCardStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TCardStyleMixin>]> }, any>;
	editor: TPageEditor;
}

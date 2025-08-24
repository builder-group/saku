import { TCtaStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { ChildAppearanceStyleMixinEditor } from '../appearance-style';
import { ChildFillStyleMixinEditor } from '../fill-style';
import { ChildShadowStyleMixinEditor } from '../shadow-style';
import { ChildStrokeStyleMixinEditor } from '../stroke-style';
import { ChildTextStyleMixinEditor } from '../text-style';

export const ChildCtaStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildCtaStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const appearanceState = useMapState(state, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.cta.appearance } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.appearance = child.childMixins.appearance;
			parent._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		get: (parent) => ({ childMixins: { fill: parent.childMixins.cta.fill } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.fill = child.childMixins.fill;
			parent._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		get: (parent) => ({ childMixins: { stroke: parent.childMixins.cta.stroke } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.stroke = child.childMixins.stroke;
			parent._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		get: (parent) => ({ childMixins: { shadow: parent.childMixins.cta.shadow } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.shadow = child.childMixins.shadow;
			parent._notify(notifyOptions);
		}
	});
	const textState = useMapState(state, {
		get: (parent) => ({ childMixins: { text: parent.childMixins.cta.text } }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta.text = child.childMixins.text;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<ChildAppearanceStyleMixinEditor state={appearanceState} />
			<div className="h-px bg-gray-200" />
			<ChildFillStyleMixinEditor state={fillState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ChildStrokeStyleMixinEditor state={strokeState} />
			<div className="h-px bg-gray-200" />
			<ChildShadowStyleMixinEditor state={shadowState} />
			<div className="h-px bg-gray-200" />
			<div>
				<Text as="span" variant="headingXl" tone="subdued">
					Text
				</Text>
			</div>
			<div className="h-px bg-gray-200" />
			<ChildTextStyleMixinEditor state={textState} editor={editor} />
		</>
	);
};

interface TChildCtaStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TCtaStyleMixin>]> }, any>;
	editor: TPageEditor;
}

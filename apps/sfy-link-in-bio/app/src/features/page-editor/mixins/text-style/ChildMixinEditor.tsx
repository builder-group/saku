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

	const flatState = useMapState(state, {
		map: (parent) => ({ childMixins: parent.childMixins.text }),
		sync: (parent, child, notifyOptions) => {
			parent._v.childMixins.text = child.childMixins;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<ChildAppearanceStyleMixinEditor state={flatState} />
			<div className="h-px bg-neutral-200" />
			<ChildTypographyStyleMixinEditor state={flatState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<ChildFillStyleMixinEditor state={flatState} editor={editor} allowedPaintTypes={['solid']} />
			<div className="h-px bg-neutral-200" />
			<ChildStrokeStyleMixinEditor state={flatState} />
			<div className="h-px bg-neutral-200" />
			<ChildShadowStyleMixinEditor state={flatState} />
		</>
	);
};

interface TChildTextStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TTextStyleMixin>]> }, any>;
	editor: TPageEditor;
}

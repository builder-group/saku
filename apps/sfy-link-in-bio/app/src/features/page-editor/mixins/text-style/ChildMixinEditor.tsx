import { TMergeMixins, TTextStyleMixin, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { ChildAppearanceStyleMixinEditor } from '../appearance-style';
import { ChildTypographyStyleMixinEditor } from '../typography-style';

export const ChildTextStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildTextStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const appearanceState = useMapState(state, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.text.appearance } }),
		set: (parent, child) => {
			parent._v.childMixins.text.appearance = child.childMixins.appearance;
			parent._notify();
		}
	});
	const typographyState = useMapState(state, {
		get: (parent) => ({ childMixins: { typography: parent.childMixins.text.typography } }),
		set: (parent, child) => {
			parent._v.childMixins.text.typography = child.childMixins.typography;
			parent._notify();
		}
	});

	return (
		<>
			<ChildAppearanceStyleMixinEditor state={appearanceState} />
			<div className="h-px bg-gray-200" />
			<ChildTypographyStyleMixinEditor state={typographyState} editor={editor} />
		</>
	);
};

interface TChildTextStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TTextStyleMixin>]> }, any>;
	editor: TPageEditor;
}

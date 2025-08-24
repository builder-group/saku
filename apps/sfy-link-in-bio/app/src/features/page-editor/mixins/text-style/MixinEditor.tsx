import { TMergeMixins, TTextStyleMixin, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
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
		set: (parent, child) => {
			parent._v.text.appearance = child.appearance;
			parent._notify();
		}
	});
	const typographyState = useMapState(state, {
		get: (parent) => ({ typography: parent.text.typography }),
		set: (parent, child) => {
			parent._v.text.typography = child.typography;
			parent._notify();
		}
	});

	const parentAppearanceState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { appearance: parent.childMixins.text.appearance } }),
		set: (parent, child) => {
			parent._v.childMixins.text.appearance = child.childMixins.appearance;
			parent._notify();
		}
	});
	const parentTypographyState = useMapState(parentState, {
		get: (parent) => ({ childMixins: { typography: parent.childMixins.text.typography } }),
		set: (parent, child) => {
			parent._v.childMixins.text.typography = child.childMixins.typography;
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

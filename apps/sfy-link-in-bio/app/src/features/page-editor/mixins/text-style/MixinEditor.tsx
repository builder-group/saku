import { TMergeMixins, TTextStyleMixin } from '@repo/editor';
import { TState } from 'feature-state';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';

export const TextStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TTextStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	return (
		<>
			<AppearanceStyleMixinEditor
				state={state}
				mapValue={(value) => value.text.appearance}
				tokenSet={editor.tokensMap.text}
				mapToken={(token) => token?.appearance}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<TypographyStyleMixinEditor
				state={state}
				mapValue={(value) => value.text.typography}
				tokenSet={editor.tokensMap.text}
				mapToken={(token) => token?.typography}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={state}
				mapValue={(value) => value.text.fill}
				applyValue={(state, value) => {
					state._v.text.fill = value;
				}}
				tokenSet={editor.tokensMap.text}
				mapToken={(token) => token?.fill}
				editor={editor}
				allowedPaintTypes={['solid']}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={state}
				mapValue={(value) => value.text.stroke}
				applyValue={(state, value) => {
					state._v.text.stroke = value;
				}}
				tokenSet={editor.tokensMap.text}
				mapToken={(token) => token?.stroke}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={state}
				mapValue={(value) => value.text.shadow}
				applyValue={(state, value) => {
					state._v.text.shadow = value;
				}}
				tokenSet={editor.tokensMap.text}
				mapToken={(token) => token?.shadow}
				editor={editor}
				disabledSpread
			/>
		</>
	);
};

interface TTextStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & TMergeMixins<[TTextStyleMixin]>, any>;
	editor: TPageEditor;
}

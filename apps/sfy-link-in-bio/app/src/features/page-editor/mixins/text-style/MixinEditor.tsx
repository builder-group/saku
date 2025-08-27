import { TTextStyleMixin, TTextStyleToken, TTokenSet } from '@repo/editor';
import { TState } from 'feature-state';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';

export const TextStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TTextStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, tokenSet, mapToken, editor } = props;

	return (
		<>
			<AppearanceStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).appearance}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.appearance}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<TypographyStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).typography}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.typography}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).fill}
				applyValue={(state, value) => {
					mapValue(state._v).fill = value;
				}}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.fill}
				editor={editor}
				allowedPaintTypes={['solid']}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).stroke}
				applyValue={(state, value) => {
					mapValue(state._v).stroke = value;
				}}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.stroke}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).shadow}
				applyValue={(state, value) => {
					mapValue(state._v).shadow = value;
				}}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.shadow}
				editor={editor}
				disabledSpread
			/>
		</>
	);
};

interface TTextStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TTextStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TTextStyleToken['value'] | undefined;
	editor: TPageEditor;
}

import { TButtonStyleMixin, TButtonStyleToken, TTokenSet } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TextStyleMixinEditor } from '../text-style';

export const ButtonStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TButtonStyleMixinEditorProps<GValue, GTokenSet>
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
			<FillStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).fill}
				applyValue={(state, value) => {
					mapValue(state._v).fill = value;
				}}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.fill}
				editor={editor}
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
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).text}
				tokenSet={tokenSet}
				mapToken={(token) => mapToken(token)?.text}
				editor={editor}
			/>
		</>
	);
};

interface TButtonStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TButtonStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TButtonStyleToken['value'] | undefined;
	editor: TPageEditor;
}

import { TMixinTokenSet, TTextStyleMixin, TTextStyleToken } from '@repo/editor';
import { TState } from 'feature-state';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';

export const TextStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TTextStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, tokenSet, mapToToken, disabledTokenLink = false, editor } = props;

	return (
		<>
			<AppearanceStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).appearance}
				tokenSet={tokenSet}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.appearance}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<TypographyStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).typography}
				tokenSet={tokenSet}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.typography}
				disabledTokenLink={disabledTokenLink}
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
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.fill}
				disabledTokenLink={disabledTokenLink}
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
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.stroke}
				disabledTokenLink={disabledTokenLink}
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
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.shadow}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
				disabledSpread // HTML text doesn't support shadow spread
			/>
		</>
	);
};

interface TTextStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TTextStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TTextStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

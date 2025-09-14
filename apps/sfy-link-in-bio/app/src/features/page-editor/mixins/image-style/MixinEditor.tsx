import { TImageStyleMixin, TImageStyleToken, TMixinTokenSet } from '@repo/editor';
import { TState } from 'feature-state';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';

export const ImageStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TImageStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const {
		state,
		mapValue,
		tokenSet,
		tokenRefKey,
		mapToToken,
		disabledTokenLink = false,
		editor
	} = props;

	return (
		<>
			<AppearanceStyleMixinEditor
				state={state}
				mapValue={(value) => mapValue(value).appearance}
				applyValue={(state, value) => {
					mapValue(state._v).appearance = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.appearance}
				disabledTokenLink={disabledTokenLink}
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
				tokenRefKey={tokenRefKey}
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
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.shadow}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
				disabledSpread
			/>
		</>
	);
};

interface TImageStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TImageStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TImageStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

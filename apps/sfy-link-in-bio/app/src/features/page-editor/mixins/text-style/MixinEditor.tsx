import { isTokenRef, TMixinTokenSet, TTextStyleMixin, TTextStyleToken } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '../../../../hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';
import { packTextTokenRef, unpackTextTokenRef } from './pack-mixin';

export const TextStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TTextStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const {
		state,
		mapValue,
		applyValue,
		tokenSet,
		tokenRefKey,
		mapToToken,
		disabledTokenLink = false,
		editor
	} = props;

	const appearanceState = useMapState(state, {
		map(baseValue) {
			const text = mapValue(baseValue);
			if (isTokenRef(text)) {
				return text;
			}
			return text?.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const text = unpackTextTokenRef(mapValue(baseState._v));
			text.appearance = mappedValue;
			applyValue(baseState, packTextTokenRef(text));
			baseState._notify(notifyOptions);
		}
	});
	const typographyState = useMapState(state, {
		map(baseValue) {
			const text = mapValue(baseValue);
			if (isTokenRef(text)) {
				return text;
			}
			return text?.typography;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const text = unpackTextTokenRef(mapValue(baseState._v));
			text.typography = mappedValue;
			applyValue(baseState, packTextTokenRef(text));
			baseState._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		map(baseValue) {
			const text = mapValue(baseValue);
			if (isTokenRef(text)) {
				return text;
			}
			return text?.fill;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const text = unpackTextTokenRef(mapValue(baseState._v));
			text.fill = mappedValue;
			applyValue(baseState, packTextTokenRef(text));
			baseState._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		map(baseValue) {
			const text = mapValue(baseValue);
			if (isTokenRef(text)) {
				return text;
			}
			return text?.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const text = unpackTextTokenRef(mapValue(baseState._v));
			text.stroke = mappedValue;
			applyValue(baseState, packTextTokenRef(text));
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		map(baseValue) {
			const text = mapValue(baseValue);
			if (isTokenRef(text)) {
				return text;
			}
			return text?.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const text = unpackTextTokenRef(mapValue(baseState._v));
			text.shadow = mappedValue;
			applyValue(baseState, packTextTokenRef(text));
			baseState._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor
				state={appearanceState}
				mapValue={(value) => value}
				applyValue={(state, value) => (state._v = value)}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.appearance}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<TypographyStyleMixinEditor
				state={typographyState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.typography}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={fillState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.fill}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
				allowedPaintTypes={['solid']}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={strokeState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.stroke}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={shadowState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
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
	applyValue: (state: TState<GValue, any>, value: TTextStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TTextStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

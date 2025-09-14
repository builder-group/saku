import { isTokenRef, TImageStyleMixin, TImageStyleToken, TMixinTokenSet } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { packImageTokenRef, unpackImageTokenRef } from './pack-mixin';

export const ImageStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TImageStyleMixinEditorProps<GValue, GTokenSet>
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
			const image = mapValue(baseValue);
			if (isTokenRef(image)) {
				return image;
			}
			return image?.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const image = unpackImageTokenRef(mapValue(baseState._v));
			image.appearance = mappedValue;
			applyValue(baseState, packImageTokenRef(image));
			baseState._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		map(baseValue) {
			const image = mapValue(baseValue);
			if (isTokenRef(image)) {
				return image;
			}
			return image?.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const image = unpackImageTokenRef(mapValue(baseState._v));
			image.stroke = mappedValue;
			applyValue(baseState, packImageTokenRef(image));
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		map(baseValue) {
			const image = mapValue(baseValue);
			if (isTokenRef(image)) {
				return image;
			}
			return image?.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const image = unpackImageTokenRef(mapValue(baseState._v));
			image.shadow = mappedValue;
			applyValue(baseState, packImageTokenRef(image));
			baseState._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor
				state={appearanceState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.appearance}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
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
	applyValue: (state: TState<GValue, any>, value: TImageStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TImageStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

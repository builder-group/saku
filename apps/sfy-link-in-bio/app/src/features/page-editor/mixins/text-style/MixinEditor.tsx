import {
	isTokenRef,
	mapTokenRef,
	TTextStyleMixin,
	TTextStyleToken,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { resolveTokenRef, TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TypographyStyleMixinEditor } from '../typography-style';
import { packTextTokenRef, unpackTextTokenRef } from './pack-mixin';

export const TextStyleMixinEditor = (props: TTextStyleMixinEditorProps) => {
	const { state, ref, disabledTokenLink = false, editor } = props;

	const appearanceState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return resolveTokenRef(baseValue, {
					tokenMap: editor.tokenMap._v
				}).unwrap().appearance;
			}
			return baseValue?.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTextTokenRef(baseState._v);
			unpackedBaseValue.appearance = mappedValue;
			baseState._v = packTextTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const typographyState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.typography;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTextTokenRef(baseState._v);
			unpackedBaseValue.typography = mappedValue;
			baseState._v = packTextTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.fill;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTextTokenRef(baseState._v);
			unpackedBaseValue.fill = mappedValue;
			baseState._v = packTextTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTextTokenRef(baseState._v);
			unpackedBaseValue.stroke = mappedValue;
			baseState._v = packTextTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTextTokenRef(baseState._v);
			unpackedBaseValue.shadow = mappedValue;
			baseState._v = packTextTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor
				state={appearanceState}
				ref={mapTokenRef(ref, 'appearance')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<TypographyStyleMixinEditor
				state={typographyState}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.typography}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={fillState}
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
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.stroke}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={shadowState}
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

interface TTextStyleMixinEditorProps {
	state: TState<TTextStyleMixin['value'], any>;
	ref: TTokenRef<TUnreferenceTop<TTextStyleToken['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

import {
	isTokenRef,
	mapTokenRef,
	TImageStyleMixin,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { packImageTokenRef, unpackImageTokenRef } from './pack-mixin';

export const ImageStyleMixinEditor = (props: TImageStyleMixinEditorProps) => {
	const { state, tokenRef, disabledTokenLink = false, editor } = props;

	const appearanceState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'appearance');
			}
			return baseValue.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackImageTokenRef(baseState._v);
			unpackedBaseValue.appearance = mappedValue;
			baseState._v = packImageTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'stroke');
			}
			return baseValue.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackImageTokenRef(baseState._v);
			unpackedBaseValue.stroke = mappedValue;
			baseState._v = packImageTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'shadow');
			}
			return baseValue.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackImageTokenRef(baseState._v);
			unpackedBaseValue.shadow = mappedValue;
			baseState._v = packImageTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor
				state={appearanceState}
				tokenRef={mapTokenRef(tokenRef, 'appearance')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />

			<StrokeStyleMixinEditor
				state={strokeState}
				tokenRef={mapTokenRef(tokenRef, 'stroke')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={shadowState}
				tokenRef={mapTokenRef(tokenRef, 'shadow')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
				disabledSpread
			/>
		</>
	);
};

interface TImageStyleMixinEditorProps {
	state: TState<TImageStyleMixin['value'], any>;
	tokenRef: TTokenRef<TUnreferenceTop<TImageStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

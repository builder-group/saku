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
	const { state, onLinkToken, disabledTokenLink = false, syncedTokenLink = true, editor } = props;

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
				onLinkToken={
					onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'appearance') : undefined
				}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={strokeState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'stroke') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={shadowState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'shadow') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				editor={editor}
				disabledSpread
			/>
		</>
	);
};

interface TImageStyleMixinEditorProps {
	state: TState<TImageStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TImageStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	editor: TPageEditor;
}

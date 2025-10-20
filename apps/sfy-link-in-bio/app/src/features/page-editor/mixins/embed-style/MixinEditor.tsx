import {
	isTokenRef,
	mapTokenRef,
	TEmbedStyleMixin,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { packEmbedTokenRef, unpackEmbedTokenRef } from './pack-mixin';

export const EmbedStyleMixinEditor = (props: TEmbedStyleMixinEditorProps) => {
	const {
		state,
		onLinkToken,
		disabledTokenLink = false,
		syncedTokenLink = true,
		disabled = false,
		editor
	} = props;

	const appearanceState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'appearance');
			}
			return baseValue.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackEmbedTokenRef(baseState._v);
			unpackedBaseValue.appearance = mappedValue;
			baseState._v = packEmbedTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackEmbedTokenRef(baseState._v);
			unpackedBaseValue.stroke = mappedValue;
			baseState._v = packEmbedTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackEmbedTokenRef(baseState._v);
			unpackedBaseValue.shadow = mappedValue;
			baseState._v = packEmbedTokenRef(unpackedBaseValue);
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
				disabled={disabled}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={strokeState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'stroke') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				disabled={disabled}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={shadowState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'shadow') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				disabled={disabled}
				editor={editor}
			/>
		</>
	);
};

interface TEmbedStyleMixinEditorProps {
	state: TState<TEmbedStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TEmbedStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	disabled?: boolean;
	editor: TPageEditor;
}

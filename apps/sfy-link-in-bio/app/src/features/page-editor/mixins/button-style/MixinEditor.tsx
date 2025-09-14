import { isTokenRef, TButtonStyleMixin, TButtonStyleToken, TMixinTokenSet } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TextStyleMixinEditor } from '../text-style';
import { packButtonTokenRef, unpackButtonTokenRef } from './pack-mixin';

export const ButtonStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TButtonStyleMixinEditorProps<GValue, GTokenSet>
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
			const button = mapValue(baseValue);
			if (isTokenRef(button)) {
				return button;
			}
			return button?.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const button = unpackButtonTokenRef(mapValue(baseState._v));
			button.appearance = mappedValue;
			applyValue(baseState, packButtonTokenRef(button));
			baseState._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		map(baseValue) {
			const button = mapValue(baseValue);
			if (isTokenRef(button)) {
				return button;
			}
			return button?.fill;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const button = unpackButtonTokenRef(mapValue(baseState._v));
			button.fill = mappedValue;
			applyValue(baseState, packButtonTokenRef(button));
			baseState._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		map(baseValue) {
			const button = mapValue(baseValue);
			if (isTokenRef(button)) {
				return button;
			}
			return button?.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const button = unpackButtonTokenRef(mapValue(baseState._v));
			button.stroke = mappedValue;
			applyValue(baseState, packButtonTokenRef(button));
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		map(baseValue) {
			const button = mapValue(baseValue);
			if (isTokenRef(button)) {
				return button;
			}
			return button?.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const button = unpackButtonTokenRef(mapValue(baseState._v));
			button.shadow = mappedValue;
			applyValue(baseState, packButtonTokenRef(button));
			baseState._notify(notifyOptions);
		}
	});
	const textState = useMapState(state, {
		map(baseValue) {
			const button = mapValue(baseValue);
			if (isTokenRef(button)) {
				return button;
			}
			return button?.text;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const button = unpackButtonTokenRef(mapValue(baseState._v));
			button.text = mappedValue;
			applyValue(baseState, packButtonTokenRef(button));
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
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={textState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.text}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
		</>
	);
};

interface TButtonStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TButtonStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TButtonStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TButtonStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

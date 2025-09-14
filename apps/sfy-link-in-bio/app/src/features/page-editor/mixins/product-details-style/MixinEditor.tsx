import {
	isTokenRef,
	TMixinTokenSet,
	TProductDetailsStyleMixin,
	TProductDetailsStyleToken
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { ButtonStyleMixinEditor } from '../button-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ImageStyleMixinEditor } from '../image-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TextStyleMixinEditor } from '../text-style';
import { packProductDetailsTokenRef, unpackProductDetailsTokenRef } from './pack-mixin';

export const ProductDetailsStyleMixinEditor = <GTokenSet extends TMixinTokenSet>(
	props: TProductDetailsStyleMixinEditorProps<GTokenSet>
) => {
	const { state, tokenSet, tokenRefKey, mapToToken, disabledTokenLink = false, editor } = props;

	const appearanceState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.appearance = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.fill = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.stroke = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.shadow = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const textXlState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.textXl;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.textXl = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const textState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.text;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.text = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const buttonPrimaryState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.buttonPrimary;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.buttonPrimary = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const imageState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.image;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackProductDetailsTokenRef(baseState._v);
			unpackedBaseValue.image = mappedValue;
			baseState._v = packProductDetailsTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	return (
		<>
			<AppearanceStyleMixinEditor
				state={appearanceState}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.appearance}
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
				disabledSpread
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Heading Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={textXlState}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.textXl}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={textState}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.text}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Primary Button
				</Text>
			</div>
			<ButtonStyleMixinEditor
				state={buttonPrimaryState}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.buttonPrimary}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Image
				</Text>
			</div>
			<ImageStyleMixinEditor
				state={imageState}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.image}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
		</>
	);
};

interface TProductDetailsStyleMixinEditorProps<GTokenSet extends TMixinTokenSet> {
	state: TState<TProductDetailsStyleMixin['value'], any>;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (
		ref: string,
		tokenSet?: GTokenSet
	) => TProductDetailsStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

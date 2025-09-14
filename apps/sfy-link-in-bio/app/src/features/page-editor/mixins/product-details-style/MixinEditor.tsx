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

export const ProductDetailsStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TProductDetailsStyleMixinEditorProps<GValue, GTokenSet>
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
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.appearance = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const fillState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.fill;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.fill = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const strokeState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.stroke = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.shadow = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const textXlState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.textXl;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.textXl = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const textState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.text;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.text = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const buttonPrimaryState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.buttonPrimary;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.buttonPrimary = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
			baseState._notify(notifyOptions);
		}
	});
	const imageState = useMapState(state, {
		map(baseValue) {
			const productDetails = mapValue(baseValue);
			if (isTokenRef(productDetails)) {
				return productDetails;
			}
			return productDetails?.image;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const productDetails = unpackProductDetailsTokenRef(mapValue(baseState._v));
			productDetails.image = mappedValue;
			applyValue(baseState, packProductDetailsTokenRef(productDetails));
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
					Heading Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={textXlState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
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
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Primary Button
				</Text>
			</div>
			<ButtonStyleMixinEditor
				state={buttonPrimaryState}
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
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
				mapValue={(value) => value}
				applyValue={(state, value) => {
					state._v = value;
				}}
				tokenSet={tokenSet}
				tokenRefKey={tokenRefKey}
				mapToToken={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.image}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
		</>
	);
};

interface TProductDetailsStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TProductDetailsStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TProductDetailsStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (
		ref: string,
		tokenSet?: GTokenSet
	) => TProductDetailsStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

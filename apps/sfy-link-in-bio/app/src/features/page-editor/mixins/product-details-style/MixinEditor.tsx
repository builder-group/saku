import {
	isTokenRef,
	mapTokenRef,
	TProductDetailsStyleMixin,
	TTokenRef,
	TUnreferenceTop
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

export const ProductDetailsStyleMixinEditor = (props: TProductDetailsStyleMixinEditorProps) => {
	const { state, ref, disabledTokenLink = false, editor } = props;

	const appearanceState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'appearance');
			}
			return baseValue.appearance;
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
				return mapTokenRef(baseValue, 'fill');
			}
			return baseValue.fill;
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
				return mapTokenRef(baseValue, 'stroke');
			}
			return baseValue.stroke;
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
				return mapTokenRef(baseValue, 'shadow');
			}
			return baseValue.shadow;
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
				return mapTokenRef(baseValue, 'textXl');
			}
			return baseValue.textXl;
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
				return mapTokenRef(baseValue, 'text');
			}
			return baseValue.text;
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
				return mapTokenRef(baseValue, 'buttonPrimary');
			}
			return baseValue.buttonPrimary;
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
				return mapTokenRef(baseValue, 'image');
			}
			return baseValue.image;
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
				ref={mapTokenRef(ref, 'appearance')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={fillState}
				ref={mapTokenRef(ref, 'fill')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={strokeState}
				ref={mapTokenRef(ref, 'stroke')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={shadowState}
				ref={mapTokenRef(ref, 'shadow')}
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
				ref={mapTokenRef(ref, 'textXl')}
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
				ref={mapTokenRef(ref, 'text')}
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
				ref={mapTokenRef(ref, 'buttonPrimary')}
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
				ref={mapTokenRef(ref, 'image')}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
		</>
	);
};

interface TProductDetailsStyleMixinEditorProps {
	state: TState<TProductDetailsStyleMixin['value'], any>;
	ref: TTokenRef<TUnreferenceTop<TProductDetailsStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

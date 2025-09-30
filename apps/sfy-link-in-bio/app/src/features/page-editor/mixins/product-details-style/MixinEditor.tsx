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
	const { state, onLinkToken, disabledTokenLink = false, syncedTokenLink = true, editor } = props;

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
				onLinkToken={
					onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'appearance') : undefined
				}
				disabledTokenLink={disabledTokenLink}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={fillState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'fill') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
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
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Heading Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={textXlState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'textXl') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				editor={editor}
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<TextStyleMixinEditor
				state={textState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'text') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				editor={editor}
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Primary Button
				</Text>
			</div>
			<ButtonStyleMixinEditor
				state={buttonPrimaryState}
				onLinkToken={
					onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'buttonPrimary') : undefined
				}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				editor={editor}
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Image
				</Text>
			</div>
			<ImageStyleMixinEditor
				state={imageState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'image') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
				editor={editor}
			/>
		</>
	);
};

interface TProductDetailsStyleMixinEditorProps {
	state: TState<TProductDetailsStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TProductDetailsStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	editor: TPageEditor;
}

import {
	isTokenRef,
	mapTokenRef,
	TBannerStyleMixin,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TextStyleMixinEditor } from '../text-style';
import { packBannerTokenRef, unpackBannerTokenRef } from './pack-mixin';

export const BannerStyleMixinEditor = (props: TBannerStyleMixinEditorProps) => {
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
			const unpackedBaseValue = unpackBannerTokenRef(baseState._v);
			unpackedBaseValue.appearance = mappedValue;
			baseState._v = packBannerTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackBannerTokenRef(baseState._v);
			unpackedBaseValue.fill = mappedValue;
			baseState._v = packBannerTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackBannerTokenRef(baseState._v);
			unpackedBaseValue.stroke = mappedValue;
			baseState._v = packBannerTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackBannerTokenRef(baseState._v);
			unpackedBaseValue.shadow = mappedValue;
			baseState._v = packBannerTokenRef(unpackedBaseValue);
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
			const unpackedBaseValue = unpackBannerTokenRef(baseState._v);
			unpackedBaseValue.text = mappedValue;
			baseState._v = packBannerTokenRef(unpackedBaseValue);
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
			<FillStyleMixinEditor
				state={fillState}
				onLinkToken={onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'fill') : undefined}
				disabledTokenLink={disabledTokenLink}
				syncedTokenLink={syncedTokenLink}
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
				disabled={disabled}
				editor={editor}
			/>
		</>
	);
};

interface TBannerStyleMixinEditorProps {
	state: TState<TBannerStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TBannerStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	disabled?: boolean;
	editor: TPageEditor;
}

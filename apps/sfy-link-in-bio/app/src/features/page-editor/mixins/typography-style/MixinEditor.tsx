import {
	fontMetadata,
	isTokenRef,
	TMixinTokenSet,
	TRef,
	TTypographyStyleMixin,
	TTypographyStyleToken
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { useMapState } from '@/hooks';
import { TokenSelectInput, TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';
import { packTypographyTokenRef, unpackTypographyTokenRef } from './pack-mixin';

export const TypographyStyleMixinEditor = <GTokenSet extends TMixinTokenSet>(
	props: TTypographyStyleMixinEditorProps<GTokenSet>
) => {
	const { state, tokenSet, tokenRefKey, mapToToken, disabledTokenLink = false, editor } = props;

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);
	const textAlignOptions = React.useMemo(() => {
		return [
			{ label: 'Start', value: 'start' },
			{ label: 'Center', value: 'center' },
			{ label: 'End', value: 'end' }
		];
	}, []);

	const fontFamilyState = useMapState(state, {
		map(baseValue): TRef<string> {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			if (isTokenRef(baseValue.font)) {
				return baseValue.font;
			}
			return baseValue.font.family;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTypographyTokenRef(baseState._v);

			if (isTokenRef(mappedValue)) {
				unpackedBaseValue.font = mappedValue;
			} else {
				const font = editor.registerFontFamily(mappedValue as string);
				if (font != null) {
					unpackedBaseValue.font = font;
				}
			}

			baseState._v = packTypographyTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const fontSizeState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue.fontSize;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTypographyTokenRef(baseState._v);
			unpackedBaseValue.fontSize = mappedValue;
			baseState._v = packTypographyTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const textAlignHorizontalState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue.textAlignHorizontal;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTypographyTokenRef(baseState._v);
			unpackedBaseValue.textAlignHorizontal = mappedValue;
			baseState._v = packTypographyTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView('settings');
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Typography
				</Text>
			</div>
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<TokenSelectInput
						label="Font Family"
						options={fontOptions}
						state={fontFamilyState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.font?.family}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
					<TokenTextInput
						label="Font Size"
						type="number"
						autoComplete="off"
						min={0}
						max={96}
						step={2}
						state={fontSizeState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.fontSize}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<TokenSelectInput
						label="Horizontal Text Align"
						options={textAlignOptions}
						state={textAlignHorizontalState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToToken?.(tokenRef, tokenSet)?.textAlignHorizontal
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
					{/* <TokenSelectInput
						label="Vertical Text Align"
						options={textAlignOptions}
						state={textAlignVerticalState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToToken?.(tokenRef, tokenSet)?.textAlignVertical
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/> */}
				</div>
			</div>
		</div>
	);
};

interface TTypographyStyleMixinEditorProps<GTokenSet extends TMixinTokenSet> {
	state: TState<TTypographyStyleMixin['value'], any>;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TTypographyStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

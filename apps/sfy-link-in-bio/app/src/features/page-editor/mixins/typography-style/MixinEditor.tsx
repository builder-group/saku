import {
	fontMetadata,
	isInherited,
	isTokenRef,
	TMergeMixins,
	TRef,
	TTypographyStyleMixin,
	TTypographyStyleToken,
	uninherit
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { TokenSelectInput, TokenTextInput } from '@/components';
import { useMapState } from '@/hooks';
import { TPageEditor, TStateTokenSet } from '../../lib';

export const TypographyStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TTypographyStyleMixinEditorProps<GValue>
) => {
	const { state, editor, tokenSet = editor.tokensMap.typography } = props;

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
			if (isTokenRef(baseValue.typography)) {
				return baseValue.typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(baseValue.typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			if (isTokenRef(baseValue.typography.font)) {
				return baseValue.typography.font;
			}
			return uninherit(baseValue.typography.font).family;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.typography) && !isInherited(baseState._v.typography)) {
				if (isTokenRef(mappedValue)) {
					baseState._v.typography.font = mappedValue;
					baseState._notify(notifyOptions);
				} else {
					const font = editor.registerFontFamily(mappedValue as string);
					if (font != null) {
						baseState._v.typography.font = font;
						state._notify();
					}
				}
			}
		}
	});
	const fontSizeState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue.typography)) {
				return baseValue.typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(baseValue.typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			return baseValue.typography.fontSize;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.typography) && !isInherited(baseState._v.typography)) {
				baseState._v.typography.fontSize = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const textAlignHorizontalState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue.typography)) {
				return baseValue.typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(baseValue.typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			return baseValue.typography.textAlignHorizontal;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.typography) && !isInherited(baseState._v.typography)) {
				baseState._v.typography.textAlignHorizontal = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const textAlignVerticalState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue.typography)) {
				return baseValue.typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(baseValue.typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			return baseValue.typography.textAlignVertical;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.typography) && !isInherited(baseState._v.typography)) {
				baseState._v.typography.textAlignVertical = mappedValue;
				baseState._notify(notifyOptions);
			}
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
						mapToTokenValue={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.font?.family}
						onNavigateToToken={handleNavigateToToken}
					/>
					<TokenTextInput
						label="Font Size"
						type="number"
						autoComplete="off"
						min={0}
						max={96}
						step={4}
						state={fontSizeState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.fontSize}
						onNavigateToToken={handleNavigateToToken}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<TokenSelectInput
						label="Horizontal Text Align"
						options={textAlignOptions}
						state={textAlignHorizontalState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.textAlignHorizontal}
						onNavigateToToken={handleNavigateToToken}
					/>
					<TokenSelectInput
						label="Vertical Text Align"
						options={textAlignOptions}
						state={textAlignVerticalState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.textAlignVertical}
						onNavigateToToken={handleNavigateToToken}
					/>
				</div>
			</div>
		</div>
	);
};

interface TTypographyStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & TMergeMixins<[TTypographyStyleMixin]>, any>;
	tokenSet?: TStateTokenSet<TTypographyStyleToken>;
	editor: TPageEditor;
}

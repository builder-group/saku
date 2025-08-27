import {
	fontMetadata,
	isInherited,
	isTokenRef,
	TRef,
	TTokenSet,
	TTypographyStyleMixin,
	TTypographyStyleToken,
	uninherit
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { TokenSelectInput, TokenTextInput } from '@/components';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';

export const TypographyStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TTypographyStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, tokenSet, mapToken, editor } = props;

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
			const typography = mapValue(baseValue);
			if (isTokenRef(typography)) {
				return typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			if (isTokenRef(typography.font)) {
				return typography.font;
			}
			return uninherit(typography.font).family;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const typography = mapValue(baseState._v);
			if (!isTokenRef(typography) && !isInherited(typography)) {
				if (isTokenRef(mappedValue)) {
					typography.font = mappedValue;
					baseState._notify(notifyOptions);
				} else {
					const font = editor.registerFontFamily(mappedValue as string);
					if (font != null) {
						typography.font = font;
						baseState._notify(notifyOptions);
					}
				}
			}
		}
	});
	const fontSizeState = useMapState(state, {
		map(baseValue) {
			const typography = mapValue(baseValue);
			if (isTokenRef(typography)) {
				return typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			return typography.fontSize;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const typography = mapValue(baseState._v);
			if (!isTokenRef(typography) && !isInherited(typography)) {
				typography.fontSize = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const textAlignHorizontalState = useMapState(state, {
		map(baseValue) {
			const typography = mapValue(baseValue);
			if (isTokenRef(typography)) {
				return typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			return typography.textAlignHorizontal;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const typography = mapValue(baseState._v);
			if (!isTokenRef(typography) && !isInherited(typography)) {
				typography.textAlignHorizontal = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const textAlignVerticalState = useMapState(state, {
		map(baseValue) {
			const typography = mapValue(baseValue);
			if (isTokenRef(typography)) {
				return typography;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(typography)) {
				throw new Error('Typography style mixin is inherited');
			}
			return typography.textAlignVertical;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const typography = mapValue(baseState._v);
			if (!isTokenRef(typography) && !isInherited(typography)) {
				typography.textAlignVertical = mappedValue;
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
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.font.family
						}
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
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.fontSize
						}
						onNavigateToToken={handleNavigateToToken}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<TokenSelectInput
						label="Horizontal Text Align"
						options={textAlignOptions}
						state={textAlignHorizontalState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.textAlignHorizontal
						}
						onNavigateToToken={handleNavigateToToken}
					/>
					<TokenSelectInput
						label="Vertical Text Align"
						options={textAlignOptions}
						state={textAlignVerticalState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.textAlignVertical
						}
						onNavigateToToken={handleNavigateToToken}
					/>
				</div>
			</div>
		</div>
	);
};

interface TTypographyStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TTypographyStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TTypographyStyleToken['value'] | undefined;
	editor: TPageEditor;
}

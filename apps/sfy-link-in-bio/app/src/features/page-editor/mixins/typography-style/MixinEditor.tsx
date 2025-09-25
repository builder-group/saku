import {
	fontMetadata,
	isTokenRef,
	mapTokenRef,
	TFontToken,
	TRef,
	TTokenPaths,
	TTokenRef,
	TTypographyStyleMixin,
	TUnreferenceTop
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { useMapState } from '@/hooks';
import { TokenSelectInput, TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';
import { packTypographyTokenRef, unpackTypographyTokenRef } from './pack-mixin';

export const TypographyStyleMixinEditor = (props: TTypographyStyleMixinEditorProps) => {
	const { state, onLinkToken, disabledTokenLink = false, editor } = props;

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
				return mapTokenRef(baseValue, 'font.family');
			}
			if (isTokenRef(baseValue.font)) {
				return mapTokenRef(baseValue.font, 'family');
			}
			return baseValue.font.family;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackTypographyTokenRef(baseState._v);

			if (isTokenRef(mappedValue)) {
				unpackedBaseValue.font = {
					type: 'token',
					key: mappedValue.key,
					tokenType: mappedValue.tokenType,
					path: mappedValue?.path?.replace('.family', '') as TTokenPaths<TFontToken>
				};
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
				return mapTokenRef(baseValue, 'fontSize');
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
				return mapTokenRef(baseValue, 'textAlignHorizontal');
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
		editor.switchView({ type: 'settings', view: { type: 'design', tab: 2 } });
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
						tokenMap={editor.tokenMap}
						onLinkToken={
							onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'font.family') : undefined
						}
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
						tokenMap={editor.tokenMap}
						onLinkToken={
							onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'fontSize') : undefined
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<TokenSelectInput
						label="Horizontal Text Align"
						options={textAlignOptions}
						state={textAlignHorizontalState}
						tokenMap={editor.tokenMap}
						onLinkToken={
							onLinkToken != null
								? () => mapTokenRef(onLinkToken(), 'textAlignHorizontal')
								: undefined
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
					{/* <TokenSelectInput
						label="Vertical Text Align"
						options={textAlignOptions}
						state={textAlignVerticalState}
						tokenMap={editor.tokenMap}
						onLinkToken={() => mapTokenRef(ref, 'textAlignVertical')}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/> */}
				</div>
			</div>
		</div>
	);
};

interface TTypographyStyleMixinEditorProps {
	state: TState<TTypographyStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TTypographyStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

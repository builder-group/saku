import {
	isTokenRef,
	TAppearanceStyleMixin,
	TAppearanceStyleToken,
	TMergeMixins
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { HideIcon, TokenTextInput, ViewIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TPageEditor, TStateTokenSet } from '../../lib';

export const AppearanceStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TAppearanceStyleMixinEditorProps<GValue>
) => {
	const { state, editor, tokenSet = editor.tokensMap.appearance } = props;

	const hasBorderRadius = useCompute(state, ({ value }) => value.appearance.borderRadius != null);

	const opacityState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue.appearance)) {
				return baseValue.appearance;
			}
			return baseValue.appearance.opacity;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.appearance)) {
				baseState._v.appearance.opacity = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const borderRadiusState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue.appearance)) {
				return baseValue.appearance;
			}
			return baseValue.appearance.borderRadius;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (!isTokenRef(baseState._v.appearance)) {
				baseState._v.appearance.borderRadius = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleVisibility = React.useCallback(() => {
		state._v.appearance.visible = !state._v.appearance.visible;
		state._notify();
	}, [state]);

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView('settings');
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Appearance
				</Text>

				{state._v.appearance.visible ? (
					<Button icon={ViewIcon} onClick={handleToggleVisibility} variant="plain" size="micro" />
				) : (
					<Button icon={HideIcon} onClick={handleToggleVisibility} variant="plain" size="micro" />
				)}
			</div>
			<div className="grid grid-cols-2 gap-3">
				<TokenTextInput
					label="Opacity"
					type="number"
					autoComplete="off"
					min={0}
					max={100}
					step={5}
					state={opacityState}
					tokenSet={tokenSet}
					mapToTokenValue={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.opacity}
					mapToDisplay={(value) => Math.round(value * 100)}
					mapToInternal={(displayValue) => displayValue / 100}
					onNavigateToToken={handleNavigateToToken}
				/>
				{hasBorderRadius && (
					<TokenTextInput
						label="Border Radius"
						type="number"
						autoComplete="off"
						min={0}
						max={999}
						step={4}
						state={borderRadiusState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.borderRadius}
						onNavigateToToken={handleNavigateToToken}
					/>
				)}
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & TMergeMixins<[TAppearanceStyleMixin]>, any>;
	tokenSet?: TStateTokenSet<TAppearanceStyleToken>;
	editor: TPageEditor;
}

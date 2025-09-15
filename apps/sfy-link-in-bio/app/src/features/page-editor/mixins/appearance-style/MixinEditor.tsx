import {
	isTokenRef,
	TAppearanceStyleMixin,
	TAppearanceStyleToken,
	TMixinTokenSet,
	tokenRef
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { PolarisHideIcon, PolarisViewIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';
import { packAppearanceTokenRef, unpackAppearanceTokenRef } from './pack-mixin';

export const AppearanceStyleMixinEditor = <GTokenSet extends TMixinTokenSet>(
	props: TAppearanceStyleMixinEditorProps<GTokenSet>
) => {
	const {
		state,
		tokenSet,
		tokenRefKey = 'default',
		mapToToken,
		disabledTokenLink = false,
		disabledVisibilityToggle = false,
		editor
	} = props;

	const visible = useCompute(
		state,
		({ value }: { value: TAppearanceStyleMixin['value'] }) => {
			if (isTokenRef(value) || isTokenRef(value.visible)) {
				return mapToToken?.(tokenRefKey, tokenSet?._v)?.visible;
			}
			return value?.visible;
		},
		[mapToToken, tokenSet]
	);
	const borderRadius = useCompute(
		state,
		({ value }: { value: TAppearanceStyleMixin['value'] }) => {
			if (isTokenRef(value) || isTokenRef(value.borderRadius)) {
				return mapToToken?.(tokenRefKey, tokenSet?._v)?.borderRadius;
			}
			return value?.borderRadius;
		},
		[mapToToken, tokenSet]
	);

	const opacityState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue.opacity;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAppearanceTokenRef(baseState._v);
			unpackedBaseValue.opacity = mappedValue;
			baseState._v = packAppearanceTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const borderRadiusState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			if (isTokenRef(baseValue.borderRadius)) {
				return baseValue.borderRadius;
			}
			return baseValue.borderRadius ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAppearanceTokenRef(baseState._v);
			unpackedBaseValue.borderRadius = mappedValue ?? null;
			baseState._v = packAppearanceTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleVisibility = React.useCallback(() => {
		const unpackedAppearance = unpackAppearanceTokenRef(state._v);
		const tokenValue = mapToToken?.(tokenRefKey, tokenSet?._v);
		const nextVisible = isTokenRef(unpackedAppearance.visible)
			? !tokenValue?.visible
			: !unpackedAppearance.visible;
		unpackedAppearance.visible =
			nextVisible === tokenValue?.visible ? tokenRef('mixin', tokenRefKey) : nextVisible;
		state._v = packAppearanceTokenRef(unpackedAppearance);
		state._notify();
	}, [mapToToken, state, tokenRefKey, tokenSet]);

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

				{!disabledVisibilityToggle &&
					(visible ? (
						<Button
							icon={PolarisViewIcon}
							onClick={handleToggleVisibility}
							variant="plain"
							size="micro"
						/>
					) : (
						<Button
							icon={PolarisHideIcon}
							onClick={handleToggleVisibility}
							variant="plain"
							size="micro"
						/>
					))}
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
					tokenRefKey={tokenRefKey}
					mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.opacity}
					mapToDisplay={(value) => Math.round(value * 100)}
					mapToInternal={(displayValue) => displayValue / 100}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
				/>
				{borderRadius != null && (
					<TokenTextInput
						label="Border Radius"
						type="number"
						autoComplete="off"
						min={0}
						max={999}
						step={4}
						state={borderRadiusState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToToken?.(tokenRef, tokenSet)?.borderRadius ?? undefined
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
				)}
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<GTokenSet extends TMixinTokenSet> {
	state: TState<TAppearanceStyleMixin['value'], any>;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TAppearanceStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	disabledVisibilityToggle?: boolean;
	editor: TPageEditor;
}

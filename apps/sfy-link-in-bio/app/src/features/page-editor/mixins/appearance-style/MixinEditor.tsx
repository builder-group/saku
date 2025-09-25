import {
	isTokenRef,
	mapTokenRef,
	TAppearanceStyleMixin,
	TRef,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { unwrapOrUndefined } from 'tuple-result';
import { PolarisHideIcon, PolarisViewIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { resolveTokenRef, TPageEditor } from '../../lib';
import { packAppearanceTokenRef, unpackAppearanceTokenRef } from './pack-mixin';

export const AppearanceStyleMixinEditor = (props: TAppearanceStyleMixinEditorProps) => {
	const {
		state,
		onLinkToken,
		disabledTokenLink = false,
		disabledVisibilityToggle = false,
		editor
	} = props;

	const visible = useCompute(
		state,
		({ value }) => {
			const [isResolveAppearanceOk, , resolvedAppearance] = resolveTokenRef(value, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolveAppearanceOk) {
				return undefined;
			}
			const [isResolvedVisibleOk, , resolvedVisible] = resolveTokenRef(resolvedAppearance.visible, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolvedVisibleOk) {
				return undefined;
			}
			return resolvedVisible;
		},
		[editor]
	);

	const opacityState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'opacity');
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
				return mapTokenRef(baseValue, 'borderRadius') as TRef<number>;
			}
			if (isTokenRef(baseValue.borderRadius)) {
				return baseValue.borderRadius as TRef<number>;
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

	const hasBorderRadius = useCompute(
		borderRadiusState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);

	// =========================================================================
	// Events
	// =========================================================================

	// TODO: Doesn't pack if its the same value as parent
	const handleToggleVisibility = React.useCallback(() => {
		const unpackedAppearance = unpackAppearanceTokenRef(state._v);
		const [isResolvedVisibleOk, , resolvedVisible] = resolveTokenRef(unpackedAppearance.visible, {
			tokenMap: editor.tokenMap._v
		});
		if (!isResolvedVisibleOk) {
			return;
		}

		const nextVisible = isTokenRef(unpackedAppearance.visible)
			? !resolvedVisible
			: !unpackedAppearance.visible;
		if (onLinkToken != null) {
			unpackedAppearance.visible =
				nextVisible === resolvedVisible ? mapTokenRef(onLinkToken(), 'visible') : nextVisible;
		} else {
			unpackedAppearance.visible = nextVisible;
		}
		state._v = packAppearanceTokenRef(unpackedAppearance);
		state._notify();
	}, [editor, onLinkToken, state]);

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView({ type: 'settings', view: { type: 'design', tab: 2 } });
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
					mapToDisplayValue={(value) => Math.round(value * 100)}
					mapToValue={(displayValue) => displayValue / 100}
					tokenMap={editor.tokenMap}
					onLinkToken={
						onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'opacity') : undefined
					}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
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
						tokenMap={editor.tokenMap}
						onLinkToken={
							onLinkToken != null
								? () => mapTokenRef(onLinkToken(), 'borderRadius') as TRef<number>
								: undefined
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
				)}
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps {
	state: TState<TAppearanceStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TAppearanceStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	disabledVisibilityToggle?: boolean;
	editor: TPageEditor;
}

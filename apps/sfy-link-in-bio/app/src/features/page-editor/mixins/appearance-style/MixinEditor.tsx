import {
	isTokenRef,
	TAppearanceStyleMixin,
	TAppearanceStyleToken,
	TMixinTokenSet
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { PolarisHideIcon, PolarisViewIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { EditorSiteResolveContext, TPageEditor } from '../../lib';
import { unpackAppearanceTokenRef } from './pack-mixin';
import { resolveAppearanceStyleMixin } from './resolve-mixin';

export const AppearanceStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TAppearanceStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const {
		state,
		mapValue,
		applyValue,
		tokenSet,
		tokenRefKey,
		mapToToken,
		disabledTokenLink = false,
		disabledVisibilityToggle = false,
		editor
	} = props;

	const resolvedAppearance = useCompute(
		state,
		({ value }) => {
			return resolveAppearanceStyleMixin(mapValue(value), {
				node: { site: new EditorSiteResolveContext(editor) },
				mixinTokenSet: tokenSet?._v,
				mapToMixinTokenValue: (ref, tokenSet) => mapToToken?.(ref, tokenSet),
				variableTokenMap: editor.variableTokenMap._v
			}).unwrap();
		},
		[state, mapValue]
	);

	const opacityState = useMapState(state, {
		map(baseValue) {
			const appearance = mapValue(baseValue);
			if (isTokenRef(appearance)) {
				return appearance;
			}
			return appearance.opacity;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const appearance = mapValue(baseState._v);
			if (!isTokenRef(appearance)) {
				appearance.opacity = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const borderRadiusState = useMapState(state, {
		map(baseValue) {
			const appearance = mapValue(baseValue);
			if (isTokenRef(appearance)) {
				return appearance;
			}
			return appearance.borderRadius;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const appearance = mapValue(baseState._v);
			if (!isTokenRef(appearance)) {
				appearance.borderRadius = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleVisibility = React.useCallback(() => {
		const appearance = mapValue(state._v);
		const unpackedAppearance = unpackAppearanceTokenRef(appearance);
		unpackedAppearance.visible = !unpackedAppearance.visible;
		applyValue(state, unpackedAppearance);
		state._notify();
	}, [mapValue, state, applyValue]);

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
					(resolvedAppearance.visible ? (
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
				{resolvedAppearance.borderRadius != null && (
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
						mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.borderRadius}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
				)}
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TAppearanceStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TAppearanceStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TAppearanceStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	disabledVisibilityToggle?: boolean;
	editor: TPageEditor;
}

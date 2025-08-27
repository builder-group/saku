import { isTokenRef, TAppearanceStyleMixin, TAppearanceStyleToken, TTokenSet } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { HideIcon, ViewIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';

export const AppearanceStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TAppearanceStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, tokenSet, mapToken, editor } = props;

	const hasBorderRadius = useCompute(state, ({ value }) => mapValue(value).borderRadius != null, [
		mapValue
	]);
	const isVisible = useCompute(state, ({ value }) => mapValue(value).visible, [mapValue]);

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
		appearance.visible = !appearance.visible;
		state._notify();
	}, [state, mapValue]);

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

				{isVisible ? (
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
					mapToTokenValue={(tokenRef, tokenSet) =>
						mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.opacity
					}
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
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.borderRadius
						}
						onNavigateToToken={handleNavigateToToken}
					/>
				)}
			</div>
		</div>
	);
};

interface TAppearanceStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TAppearanceStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TAppearanceStyleToken['value'] | undefined;
	editor: TPageEditor;
}

import { isTokenRef, TAutoLayoutStyleMixin, TAutoLayoutStyleToken, TTokenSet } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';

export const AutoLayoutStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TAutoLayoutStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, tokenSet, mapToken, editor } = props;

	const hasHorizontalPadding = useCompute(
		state,
		({ value }) => mapValue(value).horizontalPadding != null,
		[mapValue]
	);
	const hasVerticalPadding = useCompute(
		state,
		({ value }) => mapValue(value).verticalPadding != null,
		[mapValue]
	);
	const hasHorizontalGap = useCompute(state, ({ value }) => mapValue(value).horizontalGap != null, [
		mapValue
	]);
	const hasVerticalGap = useCompute(state, ({ value }) => mapValue(value).verticalGap != null, [
		mapValue
	]);

	const horizontalPaddingState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			return autoLayout.horizontalPadding;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = mapValue(baseState._v);
			if (!isTokenRef(autoLayout)) {
				autoLayout.horizontalPadding = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const verticalPaddingState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			return autoLayout.verticalPadding;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = mapValue(baseState._v);
			if (!isTokenRef(autoLayout)) {
				autoLayout.verticalPadding = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const horizontalGapState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			return autoLayout.horizontalGap;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = mapValue(baseState._v);
			if (!isTokenRef(autoLayout)) {
				autoLayout.horizontalGap = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const verticalGapState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			return autoLayout.verticalGap;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = mapValue(baseState._v);
			if (!isTokenRef(autoLayout)) {
				autoLayout.verticalGap = mappedValue;
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

	if (!hasHorizontalPadding && !hasVerticalPadding && !hasHorizontalGap && !hasVerticalGap) {
		return null;
	}

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Layout
				</Text>
			</div>
			{(hasHorizontalPadding || hasVerticalPadding) && (
				<div className="grid grid-cols-2 gap-3">
					{hasHorizontalPadding && (
						<TokenTextInput
							label="Padding (Horizontal)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={horizontalPaddingState}
							tokenSet={tokenSet}
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.horizontalPadding
							}
							onNavigateToToken={handleNavigateToToken}
						/>
					)}
					{hasVerticalPadding && (
						<TokenTextInput
							label="Padding (Vertical)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={verticalPaddingState}
							tokenSet={tokenSet}
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.verticalPadding
							}
							onNavigateToToken={handleNavigateToToken}
						/>
					)}
				</div>
			)}
			{(hasHorizontalGap || hasVerticalGap) && (
				<div className="grid grid-cols-2 gap-3">
					{hasHorizontalGap && (
						<TokenTextInput
							label="Gap (Horizontal)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={horizontalGapState}
							tokenSet={tokenSet}
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.horizontalGap
							}
							onNavigateToToken={handleNavigateToToken}
						/>
					)}
					{hasVerticalGap && (
						<TokenTextInput
							label="Gap (Vertical)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={verticalGapState}
							tokenSet={tokenSet}
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.verticalGap
							}
							onNavigateToToken={handleNavigateToToken}
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface TAutoLayoutStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TAutoLayoutStyleMixin['value'];
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TAutoLayoutStyleToken['value'] | undefined;
	editor: TPageEditor;
}

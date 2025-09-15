import {
	isTokenRef,
	TAutoLayoutStyleMixin,
	TAutoLayoutStyleToken,
	TMixinTokenSet
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from './pack-mixin';

export const AutoLayoutStyleMixinEditor = <GTokenSet extends TMixinTokenSet>(
	props: TAutoLayoutStyleMixinEditorProps<GTokenSet>
) => {
	const { state, tokenSet, tokenRefKey, mapToToken, disabledTokenLink = false, editor } = props;

	const horizontalGap = useCompute(
		state,
		({ value }) =>
			isTokenRef(value) ? mapToToken?.(value.key, tokenSet?._v)?.horizontalGap : undefined,
		[mapToToken, tokenSet]
	);
	const verticalGap = useCompute(
		state,
		({ value }) =>
			isTokenRef(value) ? mapToToken?.(value.key, tokenSet?._v)?.verticalGap : undefined,
		[mapToToken, tokenSet]
	);

	const horizontalPaddingState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue.horizontalPadding;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.horizontalPadding = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const verticalPaddingState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue.verticalPadding;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.verticalPadding = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const horizontalGapState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			if (isTokenRef(baseValue.horizontalGap)) {
				return baseValue.horizontalGap;
			}
			return baseValue.horizontalGap ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.horizontalGap = mappedValue ?? null;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const verticalGapState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			if (isTokenRef(baseValue.verticalGap)) {
				return baseValue.verticalGap;
			}
			return baseValue.verticalGap ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.verticalGap = mappedValue ?? null;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
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
					Layout
				</Text>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<TokenTextInput
					label="Padding (Horizontal)"
					type="number"
					autoComplete="off"
					min={0}
					max={96}
					step={4}
					state={horizontalPaddingState}
					tokenSet={tokenSet}
					tokenRefKey={tokenRefKey}
					mapToTokenValue={(tokenRef, tokenSet) =>
						mapToToken?.(tokenRef, tokenSet)?.horizontalPadding
					}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
				/>
				<TokenTextInput
					label="Padding (Vertical)"
					type="number"
					autoComplete="off"
					min={0}
					max={96}
					step={4}
					state={verticalPaddingState}
					tokenSet={tokenSet}
					tokenRefKey={tokenRefKey}
					mapToTokenValue={(tokenRef, tokenSet) =>
						mapToToken?.(tokenRef, tokenSet)?.verticalPadding
					}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
				/>
			</div>
			{(horizontalGap != null || verticalGap != null) && (
				<div className="grid grid-cols-2 gap-3">
					{horizontalGap != null && (
						<TokenTextInput
							label="Gap (Horizontal)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={horizontalGapState}
							tokenSet={tokenSet}
							tokenRefKey={tokenRefKey}
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToToken?.(tokenRef, tokenSet)?.horizontalGap ?? undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
						/>
					)}
					{verticalGap != null && (
						<TokenTextInput
							label="Gap (Vertical)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={verticalGapState}
							tokenSet={tokenSet}
							tokenRefKey={tokenRefKey}
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToToken?.(tokenRef, tokenSet)?.verticalGap ?? undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface TAutoLayoutStyleMixinEditorProps<GTokenSet extends TMixinTokenSet> {
	state: TState<TAutoLayoutStyleMixin['value'], any>;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TAutoLayoutStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

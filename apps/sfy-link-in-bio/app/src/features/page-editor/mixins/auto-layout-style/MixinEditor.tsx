import {
	isTokenRef,
	mapTokenRef,
	resolveTokenRef,
	TAutoLayoutStyleMixin,
	TRef,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { unwrapOrUndefined } from 'tuple-result';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from './pack-mixin';

export const AutoLayoutStyleMixinEditor = (props: TAutoLayoutStyleMixinEditorProps) => {
	const { state, onLinkToken, disabledTokenLink = false, disabled = false, editor } = props;

	const horizontalPaddingState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'horizontalPadding');
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
				return mapTokenRef(baseValue, 'verticalPadding');
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
				return mapTokenRef(baseValue, 'horizontalGap') as TRef<number>;
			}
			if (isTokenRef(baseValue.horizontalGap)) {
				return baseValue.horizontalGap as TRef<number>;
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
				return mapTokenRef(baseValue, 'verticalGap') as TRef<number>;
			}
			if (isTokenRef(baseValue.verticalGap)) {
				return baseValue.verticalGap as TRef<number>;
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

	const hasHorizontalGap = useCompute(
		horizontalGapState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);
	const hasVerticalGap = useCompute(
		verticalGapState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);

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
					tokenMap={editor.tokenMap}
					onLinkToken={
						onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'horizontalPadding') : undefined
					}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
					disabled={disabled}
				/>
				<TokenTextInput
					label="Padding (Vertical)"
					type="number"
					autoComplete="off"
					min={0}
					max={96}
					step={4}
					state={verticalPaddingState}
					tokenMap={editor.tokenMap}
					onLinkToken={
						onLinkToken != null ? () => mapTokenRef(onLinkToken(), 'verticalPadding') : undefined
					}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
					disabled={disabled}
				/>
			</div>
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
							state={horizontalGapState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'horizontalGap') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
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
							state={verticalGapState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'verticalGap') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface TAutoLayoutStyleMixinEditorProps {
	state: TState<TAutoLayoutStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TAutoLayoutStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	disabled?: boolean;
	editor: TPageEditor;
}

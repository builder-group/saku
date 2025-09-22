import {
	isTokenRef,
	mapTokenRef,
	TAutoLayoutStyleMixin,
	TRef,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { useMapState } from '@/hooks';
import { TokenTextInput } from '../../components';
import { resolveTokenRef, TPageEditor } from '../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from './pack-mixin';

export const AutoLayoutStyleMixinEditor = (props: TAutoLayoutStyleMixinEditorProps) => {
	const { state, ref, disabledTokenLink = false, editor } = props;

	const horizontalGap = useCompute(
		state,
		({ value }) => {
			const [isResolveAutoLayoutOk, , resolvedAutoLayout] = resolveTokenRef(value, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolveAutoLayoutOk) {
				return undefined;
			}

			const [isResolvedHorizontalGapOk, , resolvedHorizontalGap] = resolveTokenRef(
				resolvedAutoLayout.horizontalGap,
				{
					tokenMap: editor.tokenMap._v
				}
			);
			if (!isResolvedHorizontalGapOk) {
				return undefined;
			}

			return resolvedHorizontalGap;
		},
		[editor]
	);
	const verticalGap = useCompute(
		state,
		({ value }) => {
			const [isResolveAutoLayoutOk, , resolvedAutoLayout] = resolveTokenRef(value, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolveAutoLayoutOk) {
				return undefined;
			}

			const [isResolvedVerticalGapOk, , resolvedVerticalGap] = resolveTokenRef(
				resolvedAutoLayout.verticalGap,
				{
					tokenMap: editor.tokenMap._v
				}
			);
			if (!isResolvedVerticalGapOk) {
				return undefined;
			}

			return resolvedVerticalGap;
		},
		[editor]
	);

	const horizontalPaddingState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return resolveTokenRef(baseValue, {
					tokenMap: editor.tokenMap._v
				}).unwrap().horizontalPadding;
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
				return resolveTokenRef(baseValue, {
					tokenMap: editor.tokenMap._v
				}).unwrap().verticalPadding;
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
				return resolveTokenRef(baseValue, {
					tokenMap: editor.tokenMap._v
				}).unwrap().horizontalGap;
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
				return resolveTokenRef(baseValue, {
					tokenMap: editor.tokenMap._v
				}).unwrap().verticalGap;
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
					tokenMap={editor.tokenMap}
					onLinkToken={() => mapTokenRef(ref, 'horizontalPadding')}
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
					tokenMap={editor.tokenMap}
					onLinkToken={() => mapTokenRef(ref, 'verticalPadding')}
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
							state={horizontalGapState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={() => mapTokenRef(ref, 'horizontalGap') as TRef<number>}
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
							state={verticalGapState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={() => mapTokenRef(ref, 'verticalGap') as TRef<number>}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface TAutoLayoutStyleMixinEditorProps {
	state: TState<TAutoLayoutStyleMixin['value'], any>;
	ref: TTokenRef<TUnreferenceTop<TAutoLayoutStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

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
import { EditorSiteResolveContext, TPageEditor } from '../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from './pack-mixin';
import { resolveAutoLayoutStyleMixin } from './resolve-mixin';

export const AutoLayoutStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
>(
	props: TAutoLayoutStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const {
		state,
		mapValue,
		applyValue,
		tokenSet,
		tokenRefKey,
		mapToToken,
		disabledTokenLink = false,
		editor
	} = props;

	const resolvedAutoLayout = useCompute(
		state,
		({ value }) => {
			return resolveAutoLayoutStyleMixin(mapValue(value), {
				node: { site: new EditorSiteResolveContext(editor) },
				mixinTokenSet: tokenSet?._v,
				mapToMixinTokenValue: (ref, tokenSet) => mapToToken?.(ref, tokenSet),
				variableTokenMap: editor.variableTokenMap._v
			}).unwrap();
		},
		[mapValue]
	);

	const horizontalPaddingState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			return autoLayout.horizontalPadding;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = unpackAutoLayoutTokenRef(mapValue(baseState._v));
			autoLayout.horizontalPadding = mappedValue;
			applyValue(baseState, packAutoLayoutTokenRef(autoLayout));
			baseState._notify(notifyOptions);
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
			const autoLayout = unpackAutoLayoutTokenRef(mapValue(baseState._v));
			autoLayout.verticalPadding = mappedValue;
			applyValue(baseState, packAutoLayoutTokenRef(autoLayout));
			baseState._notify(notifyOptions);
		}
	});
	const horizontalGapState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			if (isTokenRef(autoLayout.horizontalGap)) {
				return autoLayout.horizontalGap;
			}
			return autoLayout.horizontalGap ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = unpackAutoLayoutTokenRef(mapValue(baseState._v));
			autoLayout.horizontalGap = mappedValue ?? null;
			applyValue(baseState, packAutoLayoutTokenRef(autoLayout));
			baseState._notify(notifyOptions);
		}
	});
	const verticalGapState = useMapState(state, {
		map(baseValue) {
			const autoLayout = mapValue(baseValue);
			if (isTokenRef(autoLayout)) {
				return autoLayout;
			}
			if (isTokenRef(autoLayout.verticalGap)) {
				return autoLayout.verticalGap;
			}
			return autoLayout.verticalGap ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const autoLayout = unpackAutoLayoutTokenRef(mapValue(baseState._v));
			autoLayout.verticalGap = mappedValue ?? null;
			applyValue(baseState, packAutoLayoutTokenRef(autoLayout));
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
			{(resolvedAutoLayout.horizontalGap != null || resolvedAutoLayout.verticalGap != null) && (
				<div className="grid grid-cols-2 gap-3">
					{resolvedAutoLayout.horizontalGap != null && (
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
					{resolvedAutoLayout.verticalGap != null && (
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

interface TAutoLayoutStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TAutoLayoutStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TAutoLayoutStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TAutoLayoutStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

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
import { cn } from '@/lib';
import { TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';
import { packAutoLayoutTokenRef, unpackAutoLayoutTokenRef } from './pack-mixin';

export const AutoLayoutStyleMixinEditor = (props: TAutoLayoutStyleMixinEditorProps) => {
	const {
		state,
		onLinkToken,
		disabledTokenLink = false,
		disabled = false,
		editor,
		className
	} = props;

	const horizontalPaddingState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'horizontalPadding') as TRef<number>;
			}
			if (isTokenRef(baseValue.horizontalPadding)) {
				return baseValue.horizontalPadding as TRef<number>;
			}
			return baseValue.horizontalPadding ?? undefined;
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
				return mapTokenRef(baseValue, 'verticalPadding') as TRef<number>;
			}
			if (isTokenRef(baseValue.verticalPadding)) {
				return baseValue.verticalPadding as TRef<number>;
			}
			return baseValue.verticalPadding ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.verticalPadding = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const horizontalMarginState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'horizontalMargin') as TRef<number>;
			}
			if (isTokenRef(baseValue.horizontalMargin)) {
				return baseValue.horizontalMargin as TRef<number>;
			}
			return baseValue.horizontalMargin ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.horizontalMargin = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const verticalMarginState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'verticalMargin') as TRef<number>;
			}
			if (isTokenRef(baseValue.verticalMargin)) {
				return baseValue.verticalMargin as TRef<number>;
			}
			return baseValue.verticalMargin ?? undefined;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.verticalMargin = mappedValue;
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
			unpackedBaseValue.horizontalGap = mappedValue;
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
			unpackedBaseValue.verticalGap = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	const hasHorizontalPadding = useCompute(
		horizontalPaddingState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);
	const hasVerticalPadding = useCompute(
		verticalPaddingState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);
	const hasHorizontalMargin = useCompute(
		horizontalMarginState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);
	const hasVerticalMargin = useCompute(
		verticalMarginState,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null
	);
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
		<div className={cn('space-y-3 px-4', className)}>
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
							state={horizontalPaddingState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'horizontalPadding') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
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
							state={verticalPaddingState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'verticalPadding') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					)}
				</div>
			)}
			{(hasHorizontalMargin || hasVerticalMargin) && (
				<div className="grid grid-cols-2 gap-3">
					{hasHorizontalMargin && (
						<TokenTextInput
							label="Margin (Horizontal)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={horizontalMarginState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'horizontalMargin') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					)}
					{hasVerticalMargin && (
						<TokenTextInput
							label="Margin (Vertical)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={verticalMarginState as TState<TRef<number>, any>}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'verticalMargin') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
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
	className?: string;
}

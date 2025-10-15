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
import { useCombinedCompute, useCompute } from 'feature-react';
import { createState, TState } from 'feature-state';
import React from 'react';
import { unwrapOrUndefined } from 'tuple-result';
import { MaximizeIcon, MinimizeIcon } from '@/components';
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

	const [isExpanded, setIsExpanded] = React.useState(false);

	const paddingTopState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'paddingTop') as TRef<number>;
			}
			if (isTokenRef(baseValue.paddingTop)) {
				return baseValue.paddingTop as TRef<number>;
			}
			return baseValue.paddingTop;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.paddingTop = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const paddingRightState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'paddingRight') as TRef<number>;
			}
			if (isTokenRef(baseValue.paddingRight)) {
				return baseValue.paddingRight as TRef<number>;
			}
			return baseValue.paddingRight;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.paddingRight = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const paddingBottomState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'paddingBottom') as TRef<number>;
			}
			if (isTokenRef(baseValue.paddingBottom)) {
				return baseValue.paddingBottom as TRef<number>;
			}
			return baseValue.paddingBottom;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.paddingBottom = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const paddingLeftState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'paddingLeft') as TRef<number>;
			}
			if (isTokenRef(baseValue.paddingLeft)) {
				return baseValue.paddingLeft as TRef<number>;
			}
			return baseValue.paddingLeft;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.paddingLeft = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const marginTopState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'marginTop') as TRef<number>;
			}
			if (isTokenRef(baseValue.marginTop)) {
				return baseValue.marginTop as TRef<number>;
			}
			return baseValue.marginTop;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.marginTop = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const marginRightState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'marginRight') as TRef<number>;
			}
			if (isTokenRef(baseValue.marginRight)) {
				return baseValue.marginRight as TRef<number>;
			}
			return baseValue.marginRight;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.marginRight = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const marginBottomState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'marginBottom') as TRef<number>;
			}
			if (isTokenRef(baseValue.marginBottom)) {
				return baseValue.marginBottom as TRef<number>;
			}
			return baseValue.marginBottom;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.marginBottom = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const marginLeftState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'marginLeft') as TRef<number>;
			}
			if (isTokenRef(baseValue.marginLeft)) {
				return baseValue.marginLeft as TRef<number>;
			}
			return baseValue.marginLeft;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.marginLeft = mappedValue;
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
			return baseValue.horizontalGap;
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
			return baseValue.verticalGap;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAutoLayoutTokenRef(baseState._v);
			unpackedBaseValue.verticalGap = mappedValue;
			baseState._v = packAutoLayoutTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	const paddingHorizontalState = useCombinedCompute(
		[paddingLeftState, paddingRightState],
		([{ value: left }, { value: right }]) => {
			const resolvedLeft = unwrapOrUndefined(
				resolveTokenRef(left, { tokenMap: editor.tokenMap._v })
			);
			const resolvedRight = unwrapOrUndefined(
				resolveTokenRef(right, { tokenMap: editor.tokenMap._v })
			);
			if (
				resolvedLeft != null &&
				resolvedRight != null &&
				resolvedLeft === resolvedRight &&
				isTokenRef(left) === isTokenRef(right)
			) {
				const state = createState(left);
				state.listen(({ value }) => {
					paddingLeftState.set(value);
					paddingRightState.set(value);
				});
				return state;
			}
			return null;
		},
		[editor]
	);
	const paddingVerticalState = useCombinedCompute(
		[paddingTopState, paddingBottomState],
		([{ value: top }, { value: bottom }]) => {
			const resolvedTop = unwrapOrUndefined(resolveTokenRef(top, { tokenMap: editor.tokenMap._v }));
			const resolvedBottom = unwrapOrUndefined(
				resolveTokenRef(bottom, { tokenMap: editor.tokenMap._v })
			);
			if (
				resolvedTop != null &&
				resolvedBottom != null &&
				resolvedTop === resolvedBottom &&
				isTokenRef(top) === isTokenRef(bottom)
			) {
				const state = createState(top);
				state.listen(({ value }) => {
					paddingTopState.set(value);
					paddingBottomState.set(value);
				});
				return state;
			}
			return null;
		},
		[editor]
	);
	const marginHorizontalState = useCombinedCompute(
		[marginLeftState, marginRightState],
		([{ value: left }, { value: right }]) => {
			const resolvedLeft = unwrapOrUndefined(
				resolveTokenRef(left, { tokenMap: editor.tokenMap._v })
			);
			const resolvedRight = unwrapOrUndefined(
				resolveTokenRef(right, { tokenMap: editor.tokenMap._v })
			);
			if (
				resolvedLeft != null &&
				resolvedRight != null &&
				resolvedLeft === resolvedRight &&
				isTokenRef(left) === isTokenRef(right)
			) {
				const state = createState(left);
				state.listen(({ value }) => {
					marginLeftState.set(value);
					marginRightState.set(value);
				});
				return state;
			}
			return null;
		},
		[editor]
	);
	const marginVerticalState = useCombinedCompute(
		[marginTopState, marginBottomState],
		([{ value: top }, { value: bottom }]) => {
			const resolvedTop = unwrapOrUndefined(resolveTokenRef(top, { tokenMap: editor.tokenMap._v }));
			const resolvedBottom = unwrapOrUndefined(
				resolveTokenRef(bottom, { tokenMap: editor.tokenMap._v })
			);
			if (
				resolvedTop != null &&
				resolvedBottom != null &&
				resolvedTop === resolvedBottom &&
				isTokenRef(top) === isTokenRef(bottom)
			) {
				const state = createState(top);
				state.listen(({ value }) => {
					marginTopState.set(value);
					marginBottomState.set(value);
				});
				return state;
			}
			return null;
		},
		[editor]
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
	const hasPaddingRight = useCompute(paddingRightState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasPaddingLeft = useCompute(paddingLeftState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasPaddingTop = useCompute(paddingTopState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasPaddingBottom = useCompute(paddingBottomState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasMarginRight = useCompute(marginRightState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasMarginLeft = useCompute(marginLeftState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasMarginTop = useCompute(marginTopState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});
	const hasMarginBottom = useCompute(marginBottomState, ({ value }) => {
		return unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null;
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleExpand = React.useCallback(() => {
		setIsExpanded((prev) => !prev);
	}, []);

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView({ type: 'settings', view: { type: 'design', tab: 2 } });
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Layout
				</Text>

				<button
					type="button"
					onClick={handleToggleExpand}
					disabled={disabled}
					className={cn(
						'flex items-center justify-center transition-opacity',
						disabled
							? 'cursor-not-allowed opacity-30'
							: 'cursor-pointer opacity-60 hover:opacity-100'
					)}
					title={isExpanded ? 'Collapse' : 'Expand'}
				>
					{isExpanded ? <MinimizeIcon className="h-3 w-3" /> : <MaximizeIcon className="h-3 w-3" />}
				</button>
			</div>
			{(hasPaddingRight || hasPaddingLeft || hasPaddingTop || hasPaddingBottom) && (
				<div className="grid grid-cols-2 gap-3">
					{paddingVerticalState != null && !isExpanded ? (
						<TokenTextInput
							label="Padding (Vertical)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={paddingVerticalState}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'paddingTop') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					) : (
						<>
							{hasPaddingTop && (
								<TokenTextInput
									label="Padding (Top)"
									type="number"
									autoComplete="off"
									min={0}
									max={96}
									step={4}
									state={paddingTopState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'paddingTop') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
							{hasPaddingBottom && (
								<TokenTextInput
									label="Padding (Bottom)"
									type="number"
									autoComplete="off"
									min={0}
									max={96}
									step={4}
									state={paddingBottomState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'paddingBottom') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
						</>
					)}
					{paddingHorizontalState != null && !isExpanded ? (
						<TokenTextInput
							label="Padding (Horizontal)"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={paddingHorizontalState}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'paddingLeft') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					) : (
						<>
							{hasPaddingLeft && (
								<TokenTextInput
									label="Padding (Left)"
									type="number"
									autoComplete="off"
									min={0}
									max={96}
									step={4}
									state={paddingLeftState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'paddingLeft') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
							{hasPaddingRight && (
								<TokenTextInput
									label="Padding (Right)"
									type="number"
									autoComplete="off"
									min={0}
									max={96}
									step={4}
									state={paddingRightState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'paddingRight') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
						</>
					)}
				</div>
			)}
			{(hasMarginRight || hasMarginLeft || hasMarginTop || hasMarginBottom) && (
				<div className="grid grid-cols-2 gap-3">
					{marginVerticalState != null && !isExpanded ? (
						<TokenTextInput
							label="Margin (Vertical)"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={marginVerticalState}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'marginTop') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					) : (
						<>
							{hasMarginTop && (
								<TokenTextInput
									label="Margin (Top)"
									type="number"
									autoComplete="off"
									min={-96}
									max={96}
									step={4}
									state={marginTopState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'marginTop') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
							{hasMarginBottom && (
								<TokenTextInput
									label="Margin (Bottom)"
									type="number"
									autoComplete="off"
									min={-96}
									max={96}
									step={4}
									state={marginBottomState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'marginBottom') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
						</>
					)}
					{marginHorizontalState != null && !isExpanded ? (
						<TokenTextInput
							label="Margin (Horizontal)"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={marginHorizontalState}
							tokenMap={editor.tokenMap}
							onLinkToken={
								onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'marginLeft') as TRef<number>
									: undefined
							}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabled}
						/>
					) : (
						<>
							{hasMarginLeft && (
								<TokenTextInput
									label="Margin (Left)"
									type="number"
									autoComplete="off"
									min={-96}
									max={96}
									step={4}
									state={marginLeftState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'marginLeft') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
							{hasMarginRight && (
								<TokenTextInput
									label="Margin (Right)"
									type="number"
									autoComplete="off"
									min={-96}
									max={96}
									step={4}
									state={marginRightState}
									tokenMap={editor.tokenMap}
									onLinkToken={
										onLinkToken != null
											? () => mapTokenRef(onLinkToken(), 'marginRight') as TRef<number>
											: undefined
									}
									onNavigateToToken={handleNavigateToToken}
									disabledTokenLink={disabledTokenLink}
									disabled={disabled}
								/>
							)}
						</>
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
							state={verticalGapState}
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

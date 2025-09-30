import { deepCopy } from '@blgc/utils';
import {
	isTokenRef,
	mapTokenRef,
	TStrokeStyleMixin,
	TTokenRef,
	TUnreferenceTop
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { unwrapOrUndefined } from 'tuple-result';
import { Badge, LinkIcon, LinkOffIcon, PolarisMinusIcon, PolarisPlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import {
	TokenActionOverlay,
	TokenKeyTooltip,
	TokenPaintInput,
	TokenTextInput
} from '../../components';
import { resolveTokenRef, TPageEditor } from '../../lib';
import { packStrokeTokenRef, unpackStrokeTokenRef } from './pack-mixin';

export const StrokeStyleMixinEditor = (props: TStrokeStyleMixinEditorProps) => {
	const { state, onLinkToken, disabledTokenLink = false, syncedTokenLink = true, editor } = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(value), []);
	const isSet = useCompute(
		state,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null,
		[editor]
	);

	const paintState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'paint');
			}
			return baseValue?.paint;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackStrokeTokenRef(baseState._v);
			if (unpackedBaseValue == null || mappedValue == null) {
				return;
			}
			unpackedBaseValue.paint = mappedValue;
			baseState._v = packStrokeTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const widthState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'width');
			}
			return baseValue?.width;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackStrokeTokenRef(baseState._v);
			if (unpackedBaseValue == null || mappedValue == null) {
				return;
			}
			unpackedBaseValue.width = mappedValue;
			baseState._v = packStrokeTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
			tokenMap: editor.tokenMap._v
		});
		if (isResolvedTokenOk) {
			state._v =
				resolvedToken != null
					? deepCopy(resolvedToken)
					: {
							paint: { type: 'solid', color: { r: 0, g: 0, b: 0, a: 1 } },
							width: 1
						};
			state._notify();
		}
	}, [editor, state]);

	const handleRemoveStroke = React.useCallback(() => {
		state._v = null;
		state._notify();
	}, [state]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolvedTokenOk) {
				return;
			}

			if (resolvedToken == null) {
				state._v = null;
				state._notify();
				return;
			}

			// Resolve individual properties
			const [isResolvedPaintOk, , resolvedPaint] = resolveTokenRef(resolvedToken.paint, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolvedPaintOk) {
				return;
			}
			const [isResolvedWidthOk, , resolvedWidth] = resolveTokenRef(resolvedToken.width, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolvedWidthOk) {
				return;
			}

			state._v = {
				paint: resolvedPaint,
				width: resolvedWidth
			};
			state._notify();
		} else {
			const tokenRef = onLinkToken?.();
			if (tokenRef != null) {
				state._v = tokenRef;
				state._notify();
			}
		}
	}, [isLinked, state, editor, onLinkToken]);

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView({ type: 'settings', view: { type: 'design', tab: 2 } });
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{/* Mixin-level inheritance button */}
					{!disabledTokenLink && (
						<button
							type="button"
							onClick={handleToggleTokenLink}
							className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
							title={isLinked ? 'Unlink' : 'Link'}
						>
							{isLinked ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Stroke
						</Text>
						{isLinked && (
							<Badge className="group relative hover:w-32">
								Linked
								<TokenActionOverlay
									variant={'full-overlay'}
									tooltipContent={
										isTokenRef(state._v) ? <TokenKeyTooltip tokenKey={state._v.key} /> : undefined
									}
									onUnlink={handleToggleTokenLink}
									onNavigateToToken={handleNavigateToToken}
								/>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove stroke buttons */}
				{isSet ? (
					<Button
						icon={PolarisMinusIcon}
						onClick={handleRemoveStroke}
						variant="plain"
						size="micro"
					/>
				) : (
					<Button icon={PolarisPlusIcon} onClick={handleAddStroke} variant="plain" size="micro" />
				)}
			</div>

			{isSet && (
				<div className="grid grid-cols-2 gap-3">
					<TokenPaintInput
						label="Paint"
						state={paintState}
						tokenMap={editor.tokenMap}
						onLinkToken={
							syncedTokenLink
								? () => {
										handleToggleTokenLink();
										return { preventDefault: true };
									}
								: onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'paint')
									: undefined
						}
						onUnlinkToken={
							syncedTokenLink
								? () => {
										handleToggleTokenLink();
										return { preventDefault: true };
									}
								: undefined
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
						editor={editor}
						allowedPaintTypes={['solid']}
					/>
					<TokenTextInput
						label="Width"
						type="number"
						autoComplete="off"
						min={0}
						max={20}
						step={1}
						state={widthState}
						tokenMap={editor.tokenMap}
						onLinkToken={
							syncedTokenLink
								? () => {
										handleToggleTokenLink();
										return { preventDefault: true };
									}
								: onLinkToken != null
									? () => mapTokenRef(onLinkToken(), 'width')
									: undefined
						}
						onUnlinkToken={
							syncedTokenLink
								? () => {
										handleToggleTokenLink();
										return { preventDefault: true };
									}
								: undefined
						}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
				</div>
			)}
		</div>
	);
};

interface TStrokeStyleMixinEditorProps {
	state: TState<TStrokeStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TStrokeStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	editor: TPageEditor;
}

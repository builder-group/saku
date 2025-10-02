import { deepCopy } from '@blgc/utils';
import {
	isTokenRef,
	mapTokenRef,
	resolveTokenRef,
	TFillStyleMixin,
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
import { cn } from '@/lib';
import {
	TokenActionOverlay,
	TokenKeyTooltip,
	TokenPaintInput,
	TTokenPaintInputPaintType
} from '../../components';
import { TPageEditor } from '../../lib';
import { packFillTokenRef, unpackFillTokenRef } from './pack-mixin';

export const FillStyleMixinEditor = (props: TFillStyleMixinEditorProps) => {
	const {
		state,
		onLinkToken,
		disabledTokenLink = false,
		syncedTokenLink = true,
		disabled = false,
		allowedPaintTypes,
		editor
	} = props;

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
			const unpackedBaseValue = unpackFillTokenRef(baseState._v);
			if (unpackedBaseValue == null || mappedValue == null) {
				return;
			}
			unpackedBaseValue.paint = mappedValue;
			baseState._v = packFillTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		if (disabled) {
			return;
		}

		const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
			tokenMap: editor.tokenMap._v
		});
		if (isResolvedTokenOk) {
			state._v =
				resolvedToken != null
					? deepCopy(resolvedToken)
					: {
							paint: {
								type: 'solid',
								color: { r: 255, g: 255, b: 255, a: 1 }
							},
							opacity: 1
						};
			state._notify();
		}
	}, [disabled, editor, state]);

	const handleRemoveFill = React.useCallback(() => {
		if (disabled) {
			return;
		}

		state._v = null;
		state._notify();
	}, [state, disabled]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (disabled) {
			return;
		}

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
			const [isResolvedOpacityOk, , resolvedOpacity] = resolveTokenRef(resolvedToken.opacity, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolvedOpacityOk) {
				return;
			}

			state._v = {
				paint: resolvedPaint,
				opacity: resolvedOpacity
			};
			state._notify();
		} else {
			const tokenRef = onLinkToken?.();
			if (tokenRef != null) {
				state._v = tokenRef;
				state._notify();
			}
		}
	}, [disabled, isLinked, state, editor, onLinkToken]);

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
					{!disabledTokenLink && syncedTokenLink && (
						<button
							type="button"
							onClick={handleToggleTokenLink}
							disabled={disabled}
							className={cn(
								'flex items-center justify-center transition-opacity',
								disabled
									? 'cursor-not-allowed opacity-30'
									: 'cursor-pointer opacity-60 hover:opacity-100'
							)}
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
							Fill
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
									disabled={disabled}
								/>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove fill buttons */}
				{isSet ? (
					<Button
						icon={PolarisMinusIcon}
						onClick={handleRemoveFill}
						disabled={disabled}
						variant="plain"
						size="micro"
					/>
				) : (
					<Button
						icon={PolarisPlusIcon}
						onClick={handleAddFill}
						disabled={disabled}
						variant="plain"
						size="micro"
					/>
				)}
			</div>

			{isSet && (
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
					allowedPaintTypes={allowedPaintTypes}
					disabled={disabled}
				/>
			)}
		</div>
	);
};

interface TFillStyleMixinEditorProps {
	state: TState<TFillStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TFillStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	disabled?: boolean;
	allowedPaintTypes?: TTokenPaintInputPaintType[];
	editor: TPageEditor;
}

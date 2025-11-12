import { deepCopy } from '@blgc/utils';
import {
	isTokenRef,
	mapTokenRef,
	resolveTokenRef,
	TAnimation,
	TAnimationStyleMixin,
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
	TokenSelectInput,
	TokenTextInput
} from '../../components';
import { TPageEditor } from '../../lib';
import { packAnimationTokenRef, unpackAnimationTokenRef } from './pack-mixin';

export const AnimationStyleMixinEditor = (props: TAnimationStyleMixinEditorProps) => {
	const {
		state,
		onLinkToken,
		disabledTokenLink = false,
		syncedTokenLink = true,
		disabled = false,
		editor,
		className
	} = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(value), []);
	const isSet = useCompute(
		state,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null,
		[editor]
	);

	const typeState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'animation.type');
			}
			return baseValue?.animation?.type;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAnimationTokenRef(baseState._v);
			if (unpackedBaseValue == null || mappedValue == null) {
				return;
			}
			if (unpackedBaseValue.animation != null) {
				unpackedBaseValue.animation.type = mappedValue as TAnimation['type'];
			} else {
				unpackedBaseValue.animation = {
					type: mappedValue as TAnimation['type'],
					duration: 500
				};
			}
			baseState._v = packAnimationTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});
	const durationState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'animation.duration');
			}
			return baseValue?.animation?.duration;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const unpackedBaseValue = unpackAnimationTokenRef(baseState._v);
			if (unpackedBaseValue == null || mappedValue == null) {
				return;
			}
			if (unpackedBaseValue.animation != null) {
				unpackedBaseValue.animation.duration = mappedValue;
			} else {
				unpackedBaseValue.animation = {
					type: 'pop' as TAnimation['type'],
					duration: mappedValue
				};
			}
			baseState._v = packAnimationTokenRef(unpackedBaseValue);
			baseState._notify(notifyOptions);
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddAnimation = React.useCallback(() => {
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
							animation: {
								type: 'pop' as TAnimation['type'],
								duration: 500
							}
						};
			state._notify();
		}
	}, [disabled, editor, state]);

	const handleRemoveAnimation = React.useCallback(() => {
		if (disabled) {
			return;
		}

		state._v = null;
		state._notify();
	}, [disabled, state]);

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
			const animationValue = resolvedToken.animation;
			const [isResolvedDurationOk, , resolvedDuration] = resolveTokenRef(animationValue.duration, {
				tokenMap: editor.tokenMap._v
			});
			if (!isResolvedDurationOk) {
				return;
			}

			state._v = {
				animation: {
					type: animationValue.type,
					duration: resolvedDuration
				}
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
		<div className={cn('space-y-3 px-4', className)}>
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
							Animation
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

				{/* Add/Remove animation buttons */}
				{isSet ? (
					<Button
						icon={PolarisMinusIcon}
						onClick={handleRemoveAnimation}
						disabled={disabled}
						variant="plain"
						size="micro"
					/>
				) : (
					<Button
						icon={PolarisPlusIcon}
						onClick={handleAddAnimation}
						disabled={disabled}
						variant="plain"
						size="micro"
					/>
				)}
			</div>

			{isSet && (
				<div className="grid grid-cols-2 gap-3">
					<TokenSelectInput
						label="Type"
						options={[
							{ label: 'Buzz', value: 'buzz' },
							{ label: 'Wobble', value: 'wobble' },
							{ label: 'Pop', value: 'pop' },
							{ label: 'Swipe', value: 'swipe' }
						]}
						state={typeState}
						tokenMap={editor.tokenMap}
						onLinkToken={
							syncedTokenLink
								? () => {
										handleToggleTokenLink();
										return { preventDefault: true };
									}
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
						disabled={disabled}
					/>
					<TokenTextInput
						label="Duration"
						type="number"
						autoComplete="off"
						min={0}
						max={10000}
						step={100}
						state={durationState}
						tokenMap={editor.tokenMap}
						onLinkToken={
							syncedTokenLink
								? () => {
										handleToggleTokenLink();
										return { preventDefault: true };
									}
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
						disabled={disabled}
					/>
				</div>
			)}
		</div>
	);
};

interface TAnimationStyleMixinEditorProps {
	state: TState<TAnimationStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TAnimationStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	syncedTokenLink?: boolean;
	disabled?: boolean;
	editor: TPageEditor;
	className?: string;
}

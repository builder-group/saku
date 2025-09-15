import { deepCopy } from '@blgc/utils';
import {
	isTokenRef,
	TMixinTokenSet,
	tokenRef,
	TShadowStyleMixin,
	TShadowStyleToken
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { Badge, LinkIcon, LinkOffIcon, PolarisMinusIcon, PolarisPlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenActionOverlay, TokenColorInput, TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';

export const ShadowStyleMixinEditor = <GTokenSet extends TMixinTokenSet>(
	props: TShadowStyleMixinEditorProps<GTokenSet>
) => {
	const {
		state,
		tokenSet,
		tokenRefKey = 'default',
		mapToToken,
		disabledTokenLink = false,
		editor,
		disabledSpread = false
	} = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(value), []);
	const isSet = useCompute(
		state,
		({ value }) => {
			if (isTokenRef(value)) {
				return mapToToken?.(tokenRefKey, tokenSet?._v) != null;
			}
			return value != null;
		},
		[]
	);

	const colorState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.color;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.color = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const blurState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.blur;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.blur = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const spreadState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.spread;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.spread = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const offsetXState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.offsetX;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.offsetX = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const offsetYState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.offsetY;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.offsetY = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddShadow = React.useCallback(() => {
		const tokenValue = mapToToken?.(tokenRefKey, tokenSet?._v);
		state._v =
			tokenValue != null
				? deepCopy(tokenValue)
				: {
						color: { r: 0, g: 0, b: 0, a: 0.1 },
						offsetX: 0,
						offsetY: 4,
						blur: 6,
						spread: disabledSpread ? 0 : -1
					};
		state._notify();
	}, [mapToToken, tokenSet, state, disabledSpread, tokenRefKey]);

	const handleRemoveShadow = React.useCallback(() => {
		state._v = null;
		state._notify();
	}, [state]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const tokenValue = mapToToken?.(tokenRefKey, tokenSet?._v);
			if (tokenValue !== undefined) {
				state._v = deepCopy(tokenValue);
				state._notify();
			}
		} else {
			state._v = tokenRef('mixin', tokenRefKey);
			state._notify();
		}
	}, [isLinked, state, mapToToken, tokenSet, tokenRefKey]);

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView('settings');
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
							Shadow
						</Text>
						{isLinked && (
							<Badge className="group relative hover:w-32">
								Linked
								<TokenActionOverlay
									variant={'full-overlay'}
									onUnlink={handleToggleTokenLink}
									onNavigateToToken={handleNavigateToToken}
								/>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove shadow buttons */}
				{isSet ? (
					<Button
						icon={PolarisMinusIcon}
						onClick={handleRemoveShadow}
						variant="plain"
						size="micro"
					/>
				) : (
					<Button icon={PolarisPlusIcon} onClick={handleAddShadow} variant="plain" size="micro" />
				)}
			</div>

			{isSet && (
				<div className="space-y-3">
					<TokenColorInput
						label="Color"
						state={colorState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.color}
						onLinkChange={() => {
							handleToggleTokenLink();
							return { preventDefault: true };
						}}
						onNavigateToToken={handleNavigateToToken}
						disabledTokenLink={disabledTokenLink}
					/>
					<div className="grid grid-cols-2 gap-3">
						<TokenTextInput
							label="Blur"
							type="number"
							autoComplete="off"
							min={0}
							max={96}
							step={4}
							state={blurState}
							tokenSet={tokenSet}
							tokenRefKey={tokenRefKey}
							mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.blur}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
						/>
						<TokenTextInput
							label="Spread"
							type="number"
							autoComplete="off"
							min={-48}
							max={48}
							step={4}
							state={spreadState}
							tokenSet={tokenSet}
							tokenRefKey={tokenRefKey}
							mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.spread}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
							disabled={disabledSpread}
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<TokenTextInput
							label="Offset X"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={offsetXState}
							tokenSet={tokenSet}
							tokenRefKey={tokenRefKey}
							mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.offsetX}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
						/>
						<TokenTextInput
							label="Offset Y"
							type="number"
							autoComplete="off"
							min={-96}
							max={96}
							step={4}
							state={offsetYState}
							tokenSet={tokenSet}
							tokenRefKey={tokenRefKey}
							mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.offsetY}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
							disabledTokenLink={disabledTokenLink}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

interface TShadowStyleMixinEditorProps<GTokenSet extends TMixinTokenSet> {
	state: TState<TShadowStyleMixin['value'], any>;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TShadowStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
	disabledSpread?: boolean;
}

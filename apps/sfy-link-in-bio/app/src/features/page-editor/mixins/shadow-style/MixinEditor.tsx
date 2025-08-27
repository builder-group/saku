import { deepCopy } from '@blgc/utils';
import {
	isInherited,
	isTokenRef,
	tokenRef,
	TShadowStyleMixin,
	TShadowStyleToken,
	TTokenSet
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { Badge, LinkIcon, LinkOffIcon, MinusIcon, PlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenActionOverlay, TokenColorInput, TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';

export const ShadowStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TShadowStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, applyValue, tokenSet, mapToken, editor, disabledSpread = false } = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(mapValue(value)), [mapValue]);
	const isSet = useCompute(
		state,
		({ value }) => {
			const shadow = mapValue(value);
			if (isTokenRef(shadow)) {
				return mapToken(tokenSet?._v?.[shadow.ref] as GTokenSet['value']) != null;
			}
			return shadow != null;
		},
		[mapValue]
	);

	const colorState = useMapState(state, {
		map(baseValue) {
			const shadow = mapValue(baseValue);
			if (isTokenRef(shadow)) {
				return shadow;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(shadow)) {
				throw new Error('Shadow style mixin is inherited');
			}
			return shadow?.color;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const shadow = mapValue(baseState._v);
			if (
				shadow != null &&
				!isTokenRef(shadow) &&
				!isInherited(shadow) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				shadow.color = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const blurState = useMapState(state, {
		map(baseValue) {
			const shadow = mapValue(baseValue);
			if (isTokenRef(shadow)) {
				return shadow;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(shadow)) {
				throw new Error('Shadow style mixin is inherited');
			}
			return shadow?.blur;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const shadow = mapValue(baseState._v);
			if (
				shadow != null &&
				!isTokenRef(shadow) &&
				!isInherited(shadow) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				shadow.blur = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const spreadState = useMapState(state, {
		map(baseValue) {
			const shadow = mapValue(baseValue);
			if (isTokenRef(shadow)) {
				return shadow;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(shadow)) {
				throw new Error('Shadow style mixin is inherited');
			}
			return shadow?.spread;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const shadow = mapValue(baseState._v);
			if (
				shadow != null &&
				!isTokenRef(shadow) &&
				!isInherited(shadow) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				shadow.spread = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const offsetXState = useMapState(state, {
		map(baseValue) {
			const shadow = mapValue(baseValue);
			if (isTokenRef(shadow)) {
				return shadow;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(shadow)) {
				throw new Error('Shadow style mixin is inherited');
			}
			return shadow?.offsetX;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const shadow = mapValue(baseState._v);
			if (
				shadow != null &&
				!isTokenRef(shadow) &&
				!isInherited(shadow) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				shadow.offsetX = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const offsetYState = useMapState(state, {
		map(baseValue) {
			const shadow = mapValue(baseValue);
			if (isTokenRef(shadow)) {
				return shadow;
			}
			// TODO: Remove once migrated to token references
			if (isInherited(shadow)) {
				throw new Error('Shadow style mixin is inherited');
			}
			return shadow?.offsetY;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const shadow = mapValue(baseState._v);
			if (
				shadow != null &&
				!isTokenRef(shadow) &&
				!isInherited(shadow) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				shadow.offsetY = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddShadow = React.useCallback(() => {
		const tokenValue = mapToken(tokenSet?._v?.['default'] as GTokenSet['value']);
		applyValue(
			state,
			tokenValue ?? {
				color: { r: 0, g: 0, b: 0, a: 0.1 },
				offsetX: 0,
				offsetY: 4,
				blur: 6,
				spread: disabledSpread ? 0 : -1
			}
		);
		state._notify();
	}, [mapToken, tokenSet, applyValue, state, disabledSpread]);

	const handleRemoveShadow = React.useCallback(() => {
		applyValue(state, null);
		state._notify();
	}, [state, applyValue]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const shadow = mapValue(state._v);
			const tokenValue = isTokenRef(shadow)
				? mapToken(tokenSet?._v?.[shadow.ref] as GTokenSet['value'])
				: undefined;
			if (tokenValue !== undefined) {
				applyValue(state, deepCopy(tokenValue));
				state._notify();
			}
		} else {
			applyValue(state, tokenRef('default'));
			state._notify();
		}
	}, [isLinked, mapValue, state, mapToken, tokenSet, applyValue]);

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
					<Button icon={MinusIcon} onClick={handleRemoveShadow} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddShadow} variant="plain" size="micro" />
				)}
			</div>

			{isSet && (
				<div className="space-y-3">
					<TokenColorInput
						label="Color"
						state={colorState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.color
						}
						onLinkChange={() => {
							handleToggleTokenLink();
							return { preventDefault: true };
						}}
						onNavigateToToken={handleNavigateToToken}
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
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.blur
							}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
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
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.spread
							}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
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
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.offsetX
							}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
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
							mapToTokenValue={(tokenRef, tokenSet) =>
								mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.offsetY
							}
							mapToDisplay={(value) => value}
							mapToInternal={(displayValue) => displayValue}
							onLinkChange={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onNavigateToToken={handleNavigateToToken}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

interface TShadowStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TShadowStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TShadowStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TShadowStyleToken['value'] | undefined;
	editor: TPageEditor;
	disabledSpread?: boolean;
}

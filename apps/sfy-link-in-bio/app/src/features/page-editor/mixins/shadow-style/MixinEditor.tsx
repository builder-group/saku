import { deepCopy } from '@blgc/utils';
import {
	isTokenRef,
	mapTokenRef,
	TShadowStyleMixin,
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
import { TokenActionOverlay, TokenColorInput, TokenTextInput } from '../../components';
import { resolveTokenRef, TPageEditor } from '../../lib';

export const ShadowStyleMixinEditor = (props: TShadowStyleMixinEditorProps) => {
	const { state, onLinkToken, disabledTokenLink = false, editor, disabledSpread = false } = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(value), []);
	const isSet = useCompute(
		state,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null,
		[editor]
	);

	const colorState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'color');
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
				return mapTokenRef(baseValue, 'blur');
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
				return mapTokenRef(baseValue, 'spread');
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
				return mapTokenRef(baseValue, 'offsetX');
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
				return mapTokenRef(baseValue, 'offsetY');
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
		const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
			tokenMap: editor.tokenMap._v
		});
		if (isResolvedTokenOk) {
			state._v =
				resolvedToken != null
					? deepCopy(resolvedToken)
					: {
							color: { r: 0, g: 0, b: 0, a: 0.1 },
							offsetX: 0,
							offsetY: 4,
							blur: 6,
							spread: disabledSpread ? 0 : -1
						};
			state._notify();
		}
	}, [editor, state, disabledSpread]);

	const handleRemoveShadow = React.useCallback(() => {
		state._v = null;
		state._notify();
	}, [state]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
				tokenMap: editor.tokenMap._v
			});
			if (isResolvedTokenOk) {
				state._v = deepCopy(resolvedToken);
				state._notify();
			}
		} else {
			const tokenRef = onLinkToken?.();
			if (tokenRef != null) {
				state._v = tokenRef;
				state._notify();
			}
		}
	}, [isLinked, state, editor, onLinkToken]);

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
						tokenMap={editor.tokenMap}
						onLinkToken={() => {
							handleToggleTokenLink();
							return { preventDefault: true };
						}}
						onUnlinkToken={() => {
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
							tokenMap={editor.tokenMap}
							onLinkToken={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onUnlinkToken={() => {
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
							tokenMap={editor.tokenMap}
							onLinkToken={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onUnlinkToken={() => {
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
							tokenMap={editor.tokenMap}
							onLinkToken={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onUnlinkToken={() => {
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
							tokenMap={editor.tokenMap}
							onLinkToken={() => {
								handleToggleTokenLink();
								return { preventDefault: true };
							}}
							onUnlinkToken={() => {
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

interface TShadowStyleMixinEditorProps {
	state: TState<TShadowStyleMixin['value'], any>;
	onLinkToken?: () => TTokenRef<TUnreferenceTop<TShadowStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
	disabledSpread?: boolean;
}

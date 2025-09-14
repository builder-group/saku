import { deepCopy } from '@blgc/utils';
import {
	isTokenRef,
	TMixinTokenSet,
	tokenRef,
	TStrokeStyleMixin,
	TStrokeStyleToken
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { Badge, LinkIcon, LinkOffIcon, PolarisMinusIcon, PolarisPlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenActionOverlay, TokenColorInput, TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';

export const StrokeStyleMixinEditor = <GTokenSet extends TMixinTokenSet>(
	props: TStrokeStyleMixinEditorProps<GTokenSet>
) => {
	const {
		state,
		tokenSet,
		tokenRefKey = 'default',
		mapToToken,
		disabledTokenLink = false,
		editor
	} = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(value), []);
	const isSet = useCompute(
		state,
		({ value }) => {
			if (isTokenRef(value)) {
				return mapToToken?.(value.key, tokenSet?._v) != null;
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
	const widthState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return baseValue;
			}
			return baseValue?.width;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.width = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		const tokenValue = mapToToken?.(tokenRefKey, tokenSet?._v);

		state._v = tokenValue ?? {
			color: { r: 0, g: 0, b: 0, a: 1 },
			width: 1
		};
		state._notify();
	}, [mapToToken, tokenSet, state, tokenRefKey]);

	const handleRemoveStroke = React.useCallback(() => {
		state._v = null;
		state._notify();
	}, [state]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const tokenValue = isTokenRef(state._v)
				? mapToToken?.(state._v.key, tokenSet?._v)
				: undefined;
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
							Stroke
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
					<TokenTextInput
						label="Width"
						type="number"
						autoComplete="off"
						min={0}
						max={20}
						step={1}
						state={widthState}
						tokenSet={tokenSet}
						tokenRefKey={tokenRefKey}
						mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.width}
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
			)}
		</div>
	);
};

interface TStrokeStyleMixinEditorProps<GTokenSet extends TMixinTokenSet> {
	state: TState<TStrokeStyleMixin['value'], any>;
	tokenSet?: TState<GTokenSet, any>;
	tokenRefKey?: string;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TStrokeStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

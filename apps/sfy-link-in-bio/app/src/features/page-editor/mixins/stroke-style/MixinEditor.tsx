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
import { Badge, LinkIcon, LinkOffIcon, MinusIcon, PlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenActionOverlay, TokenColorInput, TokenTextInput } from '../../components';
import { TPageEditor } from '../../lib';

export const StrokeStyleMixinEditor = <
	GValue extends Record<string, any> | null,
	GTokenSet extends TMixinTokenSet
>(
	props: TStrokeStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const {
		state,
		mapValue,
		applyValue,
		tokenSet,
		mapToToken,
		disabledTokenLink = false,
		editor
	} = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(mapValue(value)), [mapValue]);
	const isSet = useCompute(
		state,
		({ value }) => {
			const stroke = mapValue(value);
			if (isTokenRef(stroke)) {
				return mapToToken?.(stroke.key, tokenSet?._v) != null;
			}
			return stroke != null;
		},
		[mapValue]
	);

	const colorState = useMapState(state, {
		map(baseValue) {
			const stroke = mapValue(baseValue);
			if (isTokenRef(stroke)) {
				return stroke;
			}
			return stroke?.color;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const stroke = mapValue(baseState._v);
			if (
				stroke != null &&
				!isTokenRef(stroke) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				stroke.color = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});
	const widthState = useMapState(state, {
		map(baseValue) {
			const stroke = mapValue(baseValue);
			if (isTokenRef(stroke)) {
				return stroke;
			}
			return stroke?.width;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const stroke = mapValue(baseState._v);
			if (
				stroke != null &&
				!isTokenRef(stroke) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				stroke.width = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddStroke = React.useCallback(() => {
		const tokenValue = mapToToken?.('default', tokenSet?._v);
		applyValue(
			state,
			tokenValue ?? {
				color: { r: 0, g: 0, b: 0, a: 1 },
				width: 1
			}
		);
		state._notify();
	}, [mapToToken, tokenSet, state, applyValue]);

	const handleRemoveStroke = React.useCallback(() => {
		applyValue(state, null);
		state._notify();
	}, [state, applyValue]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const stroke = mapValue(state._v);
			const tokenValue = isTokenRef(stroke) ? mapToToken?.(stroke.key, tokenSet?._v) : undefined;
			if (tokenValue !== undefined) {
				applyValue(state, deepCopy(tokenValue));
				state._notify();
			}
		} else {
			applyValue(state, tokenRef('default'));
			state._notify();
		}
	}, [isLinked, mapValue, state, mapToToken, tokenSet, applyValue]);

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
					<Button icon={MinusIcon} onClick={handleRemoveStroke} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddStroke} variant="plain" size="micro" />
				)}
			</div>

			{isSet && (
				<div className="grid grid-cols-2 gap-3">
					<TokenColorInput
						label="Color"
						state={colorState}
						tokenSet={tokenSet}
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

interface TStrokeStyleMixinEditorProps<
	GValue extends Record<string, any> | null,
	GTokenSet extends TMixinTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TStrokeStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TStrokeStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TStrokeStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
}

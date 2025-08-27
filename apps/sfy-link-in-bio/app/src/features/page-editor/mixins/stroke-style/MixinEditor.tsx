import { deepCopy } from '@blgc/utils';
import {
	isInherited,
	isTokenRef,
	tokenRef,
	TStrokeStyleMixin,
	TStrokeStyleToken,
	TTokenSet
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import {
	Badge,
	InheritanceActionOverlay,
	LinkIcon,
	LinkOffIcon,
	MinusIcon,
	PlusIcon,
	TokenColorInput,
	TokenTextInput
} from '@/components';
import { useMapState } from '@/hooks';
import { TPageEditor } from '../../lib';

export const StrokeStyleMixinEditor = <
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
>(
	props: TStrokeStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const { state, mapValue, applyValue, tokenSet, mapToken, editor } = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(mapValue(value)), [mapValue]);
	const isSet = useCompute(
		state,
		({ value }) => {
			const stroke = mapValue(value);
			if (isTokenRef(stroke)) {
				return mapToken(tokenSet?._v?.[stroke.ref] as GTokenSet['value']) != null;
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
			// TODO: Remove once migrated to token references
			if (isInherited(stroke)) {
				throw new Error('Stroke style mixin is inherited');
			}
			return stroke?.color;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const stroke = mapValue(baseState._v);
			if (
				stroke != null &&
				!isTokenRef(stroke) &&
				!isInherited(stroke) &&
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
			// TODO: Remove once migrated to token references
			if (isInherited(stroke)) {
				throw new Error('Stroke style mixin is inherited');
			}
			return stroke?.width;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const stroke = mapValue(baseState._v);
			if (
				stroke != null &&
				!isTokenRef(stroke) &&
				!isInherited(stroke) &&
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
		const tokenValue = mapToken(tokenSet?._v?.['default'] as GTokenSet['value']);
		applyValue(
			state,
			tokenValue ?? {
				color: { r: 0, g: 0, b: 0, a: 1 },
				width: 1
			}
		);
		state._notify();
	}, [mapToken, tokenSet, state, applyValue]);

	const handleRemoveStroke = React.useCallback(() => {
		applyValue(state, null);
		state._notify();
	}, [state, applyValue]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const stroke = mapValue(state._v);
			const tokenValue = isTokenRef(stroke)
				? mapToken(tokenSet?._v?.[stroke.ref] as GTokenSet['value'])
				: undefined;
			if (tokenValue !== undefined) {
				applyValue(state, deepCopy(tokenValue));
				state._notify();
			}
		} else {
			applyValue(state, tokenRef('default'));
			state._notify();
		}
	}, [isLinked, mapValue, state, mapToken, tokenSet?._v, applyValue]);

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
							Stroke
						</Text>
						{isLinked && (
							<Badge className="group relative hover:w-32">
								Inherited
								<InheritanceActionOverlay
									variant={'full-overlay'}
									onUnlink={handleToggleTokenLink}
									onNavigateToParent={() => editor.switchView('settings')}
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
						autoComplete="off"
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
					<TokenTextInput
						label="Width"
						type="number"
						autoComplete="off"
						min={0}
						max={20}
						step={1}
						state={widthState}
						tokenSet={tokenSet}
						mapToTokenValue={(tokenRef, tokenSet) =>
							mapToken(tokenSet?.[tokenRef] as GTokenSet['value'])?.width
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
			)}
		</div>
	);
};

interface TStrokeStyleMixinEditorProps<
	GValue extends Record<string, any>,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TStrokeStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TStrokeStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	mapToken: (token?: GTokenSet['value']) => TStrokeStyleToken['value'] | undefined;
	editor: TPageEditor;
}

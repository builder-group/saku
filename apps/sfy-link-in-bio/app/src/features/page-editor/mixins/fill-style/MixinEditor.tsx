import { deepCopy } from '@blgc/utils';
import { isTokenRef, TFillStyleMixin, TFillStyleToken, tokenRef, TTokenSet } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { Badge, LinkIcon, LinkOffIcon, MinusIcon, PlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenActionOverlay, TokenPaintInput, TTokenPaintInputPaintType } from '../../components';
import { TPageEditor } from '../../lib';

export const FillStyleMixinEditor = <
	GValue extends Record<string, any> | null,
	GTokenSet extends TTokenSet
>(
	props: TFillStyleMixinEditorProps<GValue, GTokenSet>
) => {
	const {
		state,
		mapValue,
		applyValue,
		tokenSet,
		mapToToken,
		disabledTokenLink = false,
		editor,
		allowedPaintTypes
	} = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(mapValue(value)), [mapValue]);
	const isSet = useCompute(
		state,
		({ value }) => {
			const fill = mapValue(value);
			if (isTokenRef(fill)) {
				return mapToToken?.(fill.ref, tokenSet?._v) != null;
			}
			return fill != null;
		},
		[mapValue]
	);

	const paintState = useMapState(state, {
		map(baseValue) {
			const fill = mapValue(baseValue);
			if (isTokenRef(fill)) {
				return fill;
			}
			return fill?.paint;
		},
		sync(baseState, mappedValue, notifyOptions) {
			const fill = mapValue(baseState._v);
			if (fill != null && !isTokenRef(fill) && mappedValue != null && !isTokenRef(mappedValue)) {
				fill.paint = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		const tokenValue = mapToToken?.('default', tokenSet?._v);
		applyValue(
			state,
			tokenValue ?? {
				paint: {
					type: 'solid',
					color: { r: 255, g: 255, b: 255, a: 1 }
				},
				opacity: 1
			}
		);
		state._notify();
	}, [mapToToken, tokenSet, applyValue, state]);

	const handleRemoveFill = React.useCallback(() => {
		applyValue(state, null);
		state._notify();
	}, [applyValue, state]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const fill = mapValue(state._v);
			const tokenValue = isTokenRef(fill) ? mapToToken?.(fill.ref, tokenSet?._v) : undefined;
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
							Fill
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

				{/* Add/Remove fill buttons */}
				{isSet ? (
					<Button icon={MinusIcon} onClick={handleRemoveFill} variant="plain" size="micro" />
				) : (
					<Button icon={PlusIcon} onClick={handleAddFill} variant="plain" size="micro" />
				)}
			</div>

			{isSet && (
				<TokenPaintInput
					label="Paint"
					state={paintState}
					tokenSet={tokenSet}
					mapToTokenValue={(tokenRef, tokenSet) => mapToToken?.(tokenRef, tokenSet)?.paint}
					onLinkChange={() => {
						handleToggleTokenLink();
						return { preventDefault: true };
					}}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
					editor={editor}
					allowedPaintTypes={allowedPaintTypes}
				/>
			)}
		</div>
	);
};

interface TFillStyleMixinEditorProps<
	GValue extends Record<string, any> | null,
	GTokenSet extends TTokenSet
> {
	state: TState<GValue, any>;
	mapValue: (value: GValue) => TFillStyleMixin['value'];
	applyValue: (state: TState<GValue, any>, value: TFillStyleMixin['value']) => void;
	tokenSet?: TState<GTokenSet, any>;
	mapToToken?: (ref: string, tokenSet?: GTokenSet) => TFillStyleToken['value'] | undefined;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
	allowedPaintTypes?: TTokenPaintInputPaintType[];
}

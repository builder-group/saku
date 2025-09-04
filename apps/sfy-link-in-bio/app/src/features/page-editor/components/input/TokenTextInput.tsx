import { isTokenRef, TMixinTokenSet, tokenRef, TRef } from '@repo/editor';
import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';
import { TokenActionOverlay } from './TokenActionOverlay';

export const TokenTextInput = <
	GValue extends string | number,
	GRefValue extends TRef<GValue> | undefined,
	GMixinTokenSet extends TMixinTokenSet
>(
	props: TTokenTextInputProps<GValue, GRefValue, GMixinTokenSet>
) => {
	const {
		state,
		mapToDisplay,
		mapToInternal,
		tokenSet,
		mapToTokenValue,
		onNavigateToToken,
		onLinkChange,
		disabledTokenLink = false,
		label,
		min,
		max,
		readOnly,
		type,
		className,
		...textProps
	} = props;

	const [displayValue, setDisplayValue] = React.useState<string>('');
	const resolvedValue = useCombinedCompute(
		[state, tokenSet ?? createState(undefined)],
		([{ value: stateValue }, { value: tokenMapValue }]) => {
			const rawValue = isTokenRef(stateValue)
				? mapToTokenValue(stateValue.key, tokenMapValue)
				: (stateValue as GValue);
			if (rawValue == null) {
				return undefined;
			}
			return mapToDisplay != null ? mapToDisplay(rawValue) : rawValue;
		},
		[mapToDisplay, mapToTokenValue]
	);
	const isLinked = useCompute(state, ({ value }) => isTokenRef(value));

	// =========================================================================
	// Events
	// =========================================================================

	const handleValueChange = React.useCallback(
		(value: GRefValue) => {
			if (isTokenRef(value)) {
				state.set(value);
			} else {
				state.set((mapToInternal != null ? mapToInternal(value as GValue) : value) as GRefValue);
			}
		},
		[mapToInternal, state]
	);

	const handleTextChange = React.useCallback(
		(newValue: string) => {
			if (isLinked) {
				return;
			}

			if (newValue === '') {
				setDisplayValue('');
				return;
			}

			if (type === 'number') {
				const num = Number(newValue);
				if (isNaN(num)) {
					setDisplayValue('');
					return;
				}

				let clampedNum = num;
				if (typeof min === 'number' && clampedNum < min) clampedNum = min;
				if (typeof max === 'number' && clampedNum > max) clampedNum = max;
				setDisplayValue(String(clampedNum));
				handleValueChange(clampedNum as GRefValue);
				return;
			}

			setDisplayValue(newValue);
			handleValueChange(newValue as GRefValue);
		},
		[isLinked, type, handleValueChange, min, max]
	);

	const handleToggleTokenLink = React.useCallback(() => {
		const { preventDefault } = onLinkChange?.(isLinked) ?? {};
		if (preventDefault) {
			return;
		}

		if (isLinked) {
			const tokenValue = isTokenRef(state._v)
				? mapToTokenValue(state._v.key, tokenSet?._v)
				: undefined;
			if (tokenValue != null) {
				state.set(tokenValue as GRefValue);
			}
		} else {
			state.set(tokenRef('default') as GRefValue);
		}
	}, [onLinkChange, isLinked, state, mapToTokenValue, tokenSet]);

	// =========================================================================
	// Effects
	// =========================================================================

	React.useEffect(() => {
		if (resolvedValue != null) {
			setDisplayValue(String(resolvedValue));
		}
	}, [resolvedValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<TextField
			{...textProps}
			type={type}
			label={label}
			labelHidden
			value={displayValue}
			onChange={handleTextChange}
			readOnly={isLinked || readOnly}
			{...(type === 'number' ? { min, max } : {})}
		/>
	);

	return (
		<div className={cn('space-y-1', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="bodySm" tone="subdued">
					{label}
				</Text>
				{!disabledTokenLink && (
					<button
						type="button"
						onClick={handleToggleTokenLink}
						className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={isLinked ? `Unlink` : `Link`}
					>
						{isLinked ? <LinkOffIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
					</button>
				)}
			</div>
			<div className="group relative">
				{InputComponent}
				{isLinked && !disabledTokenLink && (
					<TokenActionOverlay
						variant={'full-overlay'}
						onUnlink={handleToggleTokenLink}
						onNavigateToToken={onNavigateToToken}
					/>
				)}
			</div>
		</div>
	);
};

export interface TTokenTextInputProps<
	GValue extends string | number,
	GRefValue extends TRef<GValue> | undefined,
	GMixinTokenSet extends TMixinTokenSet
> extends Omit<TextFieldProps, 'label' | 'labelHidden' | 'value' | 'onChange'> {
	state: TState<GRefValue, any>;
	mapToDisplay?: (value: GValue) => GValue;
	mapToInternal?: (displayValue: GValue) => GValue;

	tokenSet?: TState<GMixinTokenSet, any>;
	mapToTokenValue: (key: string, tokenSet?: GMixinTokenSet) => GValue | undefined;
	onLinkChange?: (isLinked: boolean) => { preventDefault: boolean } | void;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	className?: string;
}

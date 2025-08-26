import { isTokenRef, TRef } from '@repo/editor';
import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute, useCompute, useFeatureState } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { InheritanceActionOverlay, LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const TokenTextInput = <GValue extends string | number, GTokenValue>(
	props: TTokenTextInputProps<GValue, GTokenValue>
) => {
	const {
		state,
		tokenMap,
		mapTokenValue,
		onTokenLinkChange,
		onNavigateToToken,
		disableTokenLink = false,
		label,
		min,
		max,
		className,
		...textFieldProps
	} = props;

	const [displayValue, setDisplayValue] = React.useState<string>('');
	const value = useFeatureState(state);
	const resolvedValue = useCombinedCompute(
		[state, tokenMap],
		([{ value: stateValue }, { value: tokenMapValue }]) =>
			isTokenRef(stateValue) ? mapTokenValue(tokenMapValue, stateValue.ref) : stateValue
	);
	const isLinked = useCompute(state, ({ value }) => isTokenRef(value));

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (isLinked) {
				return;
			}

			if (newValue === '') {
				setDisplayValue('');
				return;
			}

			if (textFieldProps.type === 'number') {
				const num = Number(newValue);
				if (!isNaN(num)) {
					let clampedNum = num;
					if (typeof min === 'number' && clampedNum < min) clampedNum = min;
					if (typeof max === 'number' && clampedNum > max) clampedNum = max;
					setDisplayValue(String(clampedNum));
					state.set(clampedNum as GValue);
					return;
				}

				setDisplayValue('');
				return;
			}

			setDisplayValue(newValue);
			state.set(newValue as GValue);
		},
		[isLinked, textFieldProps.type, state, min, max]
	);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked && isTokenRef(value)) {
			onTokenLinkChange?.(false, value.ref);
		} else {
			onTokenLinkChange?.(true, 'default');
		}
	}, [isLinked, value, onTokenLinkChange]);

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
			{...textFieldProps}
			label={label}
			labelHidden
			value={displayValue}
			onChange={handleChange}
			readOnly={isLinked}
			{...(textFieldProps.type === 'number' ? { min, max } : {})}
		/>
	);

	return (
		<div className={cn('space-y-1', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="bodySm" tone="subdued">
					{label}
				</Text>
				{!disableTokenLink && (
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
				{isLinked && (
					<InheritanceActionOverlay
						variant={'full-overlay'}
						onUnlink={handleToggleTokenLink}
						onNavigateToParent={onNavigateToToken}
					/>
				)}
			</div>
		</div>
	);
};

export interface TTokenTextInputProps<GValue extends string | number, GTokenMap>
	extends Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	state: TState<TRef<GValue>, any>;

	tokenMap: TState<GTokenMap, any>;
	mapTokenValue: (tokenMap: GTokenMap, tokenRef: string) => GValue | undefined;
	onTokenLinkChange?: (shouldLinkToToken: boolean, tokenRef: string) => void;
	onNavigateToToken?: () => void;
	disableTokenLink?: boolean;

	label: string;
	className?: string;
}

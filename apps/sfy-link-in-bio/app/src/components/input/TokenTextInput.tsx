import { isTokenRef, tokenRef, TRef } from '@repo/editor';
import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute, useCompute, useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { InheritanceActionOverlay, LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const TokenTextInput = <
	GValue extends string | number,
	GRefValue extends TRef<GValue> | undefined,
	GTokenSet extends Record<string, any>
>(
	props: TTokenTextInputProps<GValue, GRefValue, GTokenSet>
) => {
	const {
		state,
		tokenSet,
		mapToTokenValue,
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
		[state, tokenSet ?? createState(undefined)],
		([{ value: stateValue }, { value: tokenMapValue }]) =>
			isTokenRef(stateValue) ? mapToTokenValue(stateValue.ref, tokenMapValue) : stateValue
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
					state.set(clampedNum as GRefValue);
					return;
				}

				setDisplayValue('');
				return;
			}

			setDisplayValue(newValue);
			state.set(newValue as GRefValue);
		},
		[isLinked, textFieldProps.type, state, min, max]
	);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const tokenValue = isTokenRef(value) ? tokenSet?._v?.[value.ref]?.value : undefined;
			if (tokenValue != null) {
				state.set(tokenValue);
			}
		} else {
			state.set(tokenRef('default') as GRefValue);
		}
	}, [isLinked, value, tokenSet?._v, state]);

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

export interface TTokenTextInputProps<
	GValue extends string | number,
	GRefValue extends TRef<GValue> | undefined,
	GTokenSet extends Record<string, any>
> extends Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	state: TState<GRefValue, any>;

	tokenSet?: TState<GTokenSet, any>;
	mapToTokenValue: (tokenRef: string, tokenSet?: GTokenSet) => GValue | undefined;
	onNavigateToToken?: () => void;
	disableTokenLink?: boolean;

	label: string;
	className?: string;
}

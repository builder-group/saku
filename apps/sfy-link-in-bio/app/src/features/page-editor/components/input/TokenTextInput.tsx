import { isTokenRef, TRef, TToken, TUnreferenceTop } from '@repo/editor';
import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';
import { resolveTokenRef } from '../../lib';
import { isPreventDefault, TPreventDefault } from './prevent-default';
import { TokenActionOverlay } from './TokenActionOverlay';

export const TokenTextInput = <GRefValue extends TRef<string | number> | undefined>(
	props: TTokenTextInputProps<GRefValue>
) => {
	const {
		state,
		mapToDisplayValue,
		mapToValue,
		tokenMap,
		onLinkToken,
		onUnlinkToken,
		onNavigateToToken,
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
		[state, tokenMap],
		([stateCx, tokenMapCx]) => {
			if (stateCx.value == null) {
				return undefined;
			}
			const [isResolvedValue, , resolvedValue] = resolveTokenRef(stateCx.value, {
				tokenMap: tokenMapCx?.value
			});
			if (!isResolvedValue) {
				return undefined;
			}
			return mapToDisplayValue != null
				? mapToDisplayValue(resolvedValue as TUnreferenceTop<GRefValue>)
				: (resolvedValue as TUnreferenceTop<GRefValue>);
		},
		[mapToDisplayValue]
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
				state.set(
					(mapToValue != null
						? mapToValue(value as TUnreferenceTop<GRefValue>)
						: value) as GRefValue
				);
			}
		},
		[mapToValue, state]
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
		// Unlink token
		if (isLinked) {
			const result = onUnlinkToken?.();
			if (isPreventDefault(result)) {
				return;
			}
			const [isResolvedTokenOk, , tokenValue] = resolveTokenRef(state._v, {
				tokenMap: tokenMap?._v
			});
			if (isResolvedTokenOk && tokenValue != null) {
				state.set(tokenValue as GRefValue);
			}
			return;
		}

		// Link token
		const result = onLinkToken?.();
		if (isPreventDefault(result)) {
			return;
		}
		if (isTokenRef(result)) {
			state.set(result as GRefValue);
		}
	}, [onLinkToken, onUnlinkToken, isLinked, state, tokenMap]);

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

export interface TTokenTextInputProps<GRefValue extends TRef<string | number> | undefined>
	extends Omit<TextFieldProps, 'label' | 'labelHidden' | 'value' | 'onChange'> {
	state: TState<GRefValue, any>;
	mapToDisplayValue?: (value: TUnreferenceTop<GRefValue>) => TUnreferenceTop<GRefValue>;
	mapToValue?: (displayValue: TUnreferenceTop<GRefValue>) => GRefValue;

	tokenMap?: TState<Record<TToken['key'], TToken>, any>;
	onLinkToken?: () => GRefValue | TPreventDefault;
	onUnlinkToken?: () => void | TPreventDefault;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	className?: string;
}

import { isTokenRef, resolveTokenRef, TRef, TToken } from '@repo/editor';
import { Select, SelectProps, Text } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';
import { isPreventDefault, TPreventDefault } from './prevent-default';
import { TokenActionOverlay, TokenKeyTooltip } from './TokenActionOverlay';

export const TokenSelectInput = <GRefValue extends TRef<string> | undefined>(
	props: TTokenSelectInputProps<GRefValue>
) => {
	const {
		state,
		tokenMap,
		onLinkToken,
		onUnlinkToken,
		onNavigateToToken,
		disabledTokenLink = false,
		label,
		disabled = false,
		className,
		...selectProps
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
			return resolvedValue;
		},
		[]
	);
	const isLinked = useCompute(state, ({ value }) => isTokenRef(value));

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (isLinked || disabled) {
				return;
			}

			if (newValue === '') {
				setDisplayValue('');
				return;
			}

			setDisplayValue(newValue);
			state.set(newValue as GRefValue);
		},
		[isLinked, disabled, state]
	);

	const handleToggleTokenLink = React.useCallback(() => {
		if (disabled) {
			return;
		}

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
	}, [disabled, isLinked, onLinkToken, onUnlinkToken, state, tokenMap]);

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
		<Select
			{...selectProps}
			label={label}
			labelHidden
			value={displayValue}
			onChange={handleChange}
			disabled={isLinked || disabled}
		/>
	);

	return (
		<div className={cn('space-y-1', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="bodySm" tone="subdued">
					{label}
				</Text>
				{!disabledTokenLink && (onLinkToken != null || isLinked) && (
					<button
						type="button"
						onClick={handleToggleTokenLink}
						disabled={disabled}
						className={cn(
							'flex items-center justify-center transition-opacity',
							disabled
								? 'cursor-not-allowed opacity-30'
								: 'cursor-pointer opacity-60 hover:opacity-100'
						)}
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
						tooltipContent={
							isTokenRef(state._v) ? <TokenKeyTooltip tokenKey={state._v.key} /> : undefined
						}
						onUnlink={handleToggleTokenLink}
						onNavigateToToken={onNavigateToToken}
						disabled={disabled}
					/>
				)}
			</div>
		</div>
	);
};

export interface TTokenSelectInputProps<GRefValue extends TRef<string> | undefined> extends Omit<
	SelectProps,
	'label' | 'labelHidden' | 'value' | 'onChange'
> {
	state: TState<GRefValue, any>;

	tokenMap?: TState<Record<TToken['key'], TToken>, any>;
	onLinkToken?: () => GRefValue | TPreventDefault;
	onUnlinkToken?: () => void | TPreventDefault;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	disabled?: boolean;
	className?: string;
}

import { isTokenRef, tokenRef, TRef, TTokenSet } from '@repo/editor';
import { Select, SelectProps, Text } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';
import { TokenActionOverlay } from './TokenActionOverlay';

export const TokenSelectInput = <
	GValue extends string,
	GRefValue extends TRef<GValue> | undefined,
	GTokenSet extends TTokenSet
>(
	props: TTokenSelectInputProps<GValue, GRefValue, GTokenSet>
) => {
	const {
		state,
		tokenSet,
		mapToTokenValue,
		onLinkChange,
		onNavigateToToken,
		disabledTokenLink = false,
		label,
		disabled,
		className,
		...selectProps
	} = props;

	const [displayValue, setDisplayValue] = React.useState<string>('');
	const resolvedValue = useCombinedCompute(
		[state, tokenSet ?? createState(undefined)],
		([{ value: stateValue }, { value: tokenMapValue }]) => {
			return isTokenRef(stateValue)
				? mapToTokenValue(stateValue.ref, tokenMapValue)
				: (stateValue as GValue);
		},
		[mapToTokenValue]
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

			setDisplayValue(newValue);
			state.set(newValue as GRefValue);
		},
		[isLinked, state]
	);

	const handleToggleTokenLink = React.useCallback(() => {
		const { preventDefault } = onLinkChange?.(isLinked) ?? {};
		if (preventDefault) {
			return;
		}

		if (isLinked) {
			const tokenValue = isTokenRef(state._v)
				? mapToTokenValue(state._v.ref, tokenSet?._v)
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

export interface TTokenSelectInputProps<
	GValue extends string,
	GRefValue extends TRef<GValue> | undefined,
	GTokenSet extends TTokenSet
> extends Omit<SelectProps, 'label' | 'labelHidden' | 'value' | 'onChange'> {
	state: TState<GRefValue, any>;

	tokenSet?: TState<GTokenSet, any>;
	mapToTokenValue: (tokenRef: string, tokenSet?: GTokenSet) => GValue | undefined;
	onLinkChange?: (isLinked: boolean) => { preventDefault: boolean } | void;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	className?: string;
}

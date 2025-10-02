import { isTokenRef, TRef, TToken } from '@repo/editor';
import { Text, Tooltip } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Badge, Knob, LinkIcon, LinkOffIcon, TKnobProps } from '@/components';
import { cn } from '@/lib';
import { resolveTokenRef } from '../../lib';
import { isPreventDefault, TPreventDefault } from './prevent-default';
import { TokenActionOverlay, TokenKeyTooltip } from './TokenActionOverlay';

export const TokenToggleInput = <GRefValue extends TRef<boolean> | undefined>(
	props: TTokenToggleInputProps<GRefValue>
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
		...knobProps
	} = props;

	const [displayValue, setDisplayValue] = React.useState<boolean>(false);
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

	const handleToggle = React.useCallback(() => {
		if (isLinked || disabled) {
			return;
		}

		setDisplayValue(!displayValue);
		state.set((value) => !value as GRefValue);
	}, [displayValue, isLinked, disabled, state]);

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
		setDisplayValue(resolvedValue === true);
	}, [resolvedValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<Knob
			{...knobProps}
			ariaLabel={label}
			selected={displayValue}
			onClick={handleToggle}
			disabled={isLinked || disabled}
		/>
	);

	return (
		<div className={cn('space-y-1', className)}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Text as="span" variant="bodySm" tone="subdued">
						{label}
					</Text>
					{isLinked && !disabledTokenLink && (
						<Badge className="group relative hover:w-32">
							Linked
							<TokenActionOverlay
								variant={'full-overlay'}
								tooltipContent={
									isTokenRef(state._v) ? <TokenKeyTooltip tokenKey={state._v.key} /> : undefined
								}
								onUnlink={handleToggleTokenLink}
								onNavigateToToken={onNavigateToToken}
								disabled={disabled}
							/>
						</Badge>
					)}
				</div>
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
						title={isLinked ? 'Unlink' : 'Link'}
					>
						{isLinked ? <LinkOffIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
					</button>
				)}
			</div>
			<div className="space-y-1">
				{isLinked ? (
					<Tooltip
						content={
							<span>
								This toggle is inherited from the parent. Click the unlink icon (
								<LinkOffIcon className="inline h-3 w-3" />) to set a custom value.
							</span>
						}
						preferredPosition="below"
						hoverDelay={500}
					>
						{InputComponent}
					</Tooltip>
				) : (
					InputComponent
				)}
			</div>
		</div>
	);
};

export interface TTokenToggleInputProps<GRefValue extends TRef<boolean> | undefined>
	extends Omit<TKnobProps, 'ariaLabel' | 'selected' | 'onClick'> {
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

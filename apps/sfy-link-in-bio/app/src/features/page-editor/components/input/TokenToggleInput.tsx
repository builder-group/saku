import { isTokenRef, TRef, TToken } from '@repo/editor';
import { Text, Tooltip } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Knob, LinkIcon, LinkOffIcon, TKnobProps } from '@/components';
import { cn } from '@/lib';
import { resolveTokenRef } from '../../lib';
import { isPreventDefault, TPreventDefault } from './prevent-default';

export const TokenToggleInput = <GRefValue extends TRef<boolean> | undefined>(
	props: TTokenToggleInputProps<GRefValue>
) => {
	const {
		state,
		tokenMap,
		onLinkToken,
		onUnlinkToken,
		disabledTokenLink = false,
		label,
		disabled,
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
		if (isLinked) {
			return;
		}

		setDisplayValue(!displayValue);
		state.set((value) => !value as GRefValue);
	}, [displayValue, isLinked, state]);

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
		setDisplayValue(resolvedValue === true);
	}, [resolvedValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<Knob
			{...knobProps}
			selected={displayValue}
			onClick={handleToggle}
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
	extends Omit<TKnobProps, 'selected' | 'onClick'> {
	state: TState<GRefValue, any>;

	tokenMap?: TState<Record<TToken['key'], TToken>, any>;
	onLinkToken?: () => GRefValue | TPreventDefault;
	onUnlinkToken?: () => void | TPreventDefault;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	className?: string;
}

import { isTokenRef, TMixinTokenSet, tokenRef, TRef } from '@repo/editor';
import { Text, Tooltip } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { Knob, LinkIcon, LinkOffIcon, TKnobProps } from '@/components';
import { cn } from '@/lib';

export const TokenToggleInput = <
	GValue extends boolean,
	GRefValue extends TRef<GValue> | undefined,
	GMixinTokenSet extends TMixinTokenSet
>(
	props: TTokenToggleInputProps<GValue, GRefValue, GMixinTokenSet>
) => {
	const {
		state,
		tokenSet,
		mapToTokenValue,
		onNavigateToToken,
		onLinkChange,
		disabledTokenLink = false,
		label,
		disabled,
		className,
		...knobProps
	} = props;

	const [displayValue, setDisplayValue] = React.useState<boolean>(false);
	const resolvedValue = useCombinedCompute(
		[state, tokenSet ?? createState(undefined)],
		([{ value: stateValue }, { value: tokenMapValue }]) => {
			return isTokenRef(stateValue)
				? mapToTokenValue(stateValue.key, tokenMapValue)
				: (stateValue as GValue);
		},
		[mapToTokenValue]
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

export interface TTokenToggleInputProps<
	GValue extends boolean,
	GRefValue extends TRef<GValue> | undefined,
	GMixinTokenSet extends TMixinTokenSet
> extends Omit<TKnobProps, 'selected' | 'onClick'> {
	state: TState<GRefValue, any>;

	tokenSet?: TState<GMixinTokenSet, any>;
	mapToTokenValue: (key: string, tokenSet?: GMixinTokenSet) => GValue | undefined;
	onLinkChange?: (isLinked: boolean) => { preventDefault: boolean } | void;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	className?: string;
}

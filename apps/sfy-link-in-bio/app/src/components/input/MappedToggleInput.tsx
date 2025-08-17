import { isInherited, resolveReference, TReference } from '@repo/editor';
import { Text, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Knob, LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const MappedToggleInput = <GStateValue, GParentStateValue>(
	props: TMappedToggleInputProps<GStateValue, GParentStateValue>
) => {
	const {
		state,
		mapValue,
		onValueChange,
		onInheritChange,
		parentState,
		mapParentValue,
		disableFieldInheritance = false,
		ariaLabel,
		label,
		className
	} = props;

	const currentValue = useCompute(state, ({ value }) => mapValue(value));
	const parentValue = useCompute(parentState, ({ value: parent }) =>
		parent != null ? mapParentValue?.(parent) : undefined
	);
	const isValueInherited = React.useMemo(() => isInherited(currentValue), [currentValue]);
	const selected = React.useMemo(() => {
		const resolvedValue = resolveReference(currentValue, parentValue);
		return resolvedValue === true;
	}, [currentValue, parentValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggle = React.useCallback(() => {
		if (isValueInherited) {
			return;
		}

		onValueChange(!currentValue);
	}, [onValueChange, isValueInherited, currentValue]);

	const handleToggleInheritance = React.useCallback(() => {
		onInheritChange?.(!isValueInherited, parentValue);
	}, [onInheritChange, isValueInherited, parentValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<Knob
			ariaLabel={ariaLabel || `Toggle ${label}`}
			selected={selected}
			onClick={handleToggle}
			disabled={isValueInherited}
		/>
	);

	return (
		<div className={cn('space-y-1', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="bodySm" tone="subdued">
					{label}
				</Text>
				{parentValue != null && !disableFieldInheritance && (
					<button
						type="button"
						onClick={handleToggleInheritance}
						className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={isValueInherited ? 'Unlink from parent' : 'Link to parent'}
					>
						{isValueInherited ? (
							<LinkOffIcon className="h-3 w-3" />
						) : (
							<LinkIcon className="h-3 w-3" />
						)}
					</button>
				)}
			</div>
			<div className="space-y-1">
				{isValueInherited ? (
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

export interface TMappedToggleInputProps<GStateValue, GParentStateValue> {
	// Value handling
	state: TState<GStateValue, any>;
	mapValue: (stateValue: GStateValue) => TReference<boolean> | undefined;
	onValueChange: (value: boolean | undefined) => void;

	// Parent/inheritance handling
	parentState?: TState<GParentStateValue, any>;
	mapParentValue?: (parentStateValue: GParentStateValue) => boolean | undefined;
	onInheritChange?: (shouldInherit: boolean, parentValue?: boolean) => void;
	disableFieldInheritance?: boolean;

	ariaLabel?: string;
	label: string;
	className?: string;
}

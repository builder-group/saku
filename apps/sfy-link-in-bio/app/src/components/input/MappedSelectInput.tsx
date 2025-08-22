import { isInherited, resolveReference, TReference } from '@repo/editor';
import { Select, SelectProps, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { InheritanceActionOverlay, LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const MappedSelectInput = <GValue, GStateValue, GParentStateValue>(
	props: TMappedSelectInputProps<GValue, GStateValue, GParentStateValue>
) => {
	const {
		state,
		mapValue,
		onValueChange,
		onInheritChange,
		onNavigateToParent,
		parentState,
		mapParentValue,
		disableFieldInheritance = false,
		label,
		className,
		...selectProps
	} = props;

	const currentValue = useCompute(state, ({ value }) => mapValue(value));
	const parentValue = useCompute(parentState, ({ value: parent }) =>
		parent != null ? mapParentValue?.(parent) : undefined
	);
	const isValueInherited = React.useMemo(() => isInherited(currentValue), [currentValue]);
	const displayValue = React.useMemo(() => {
		const resolvedValue = resolveReference(currentValue, parentValue);
		return resolvedValue != null ? String(resolvedValue) : '';
	}, [currentValue, parentValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (isValueInherited) {
				return;
			}

			const convertedValue: GValue | undefined = newValue === '' ? undefined : (newValue as GValue);

			onValueChange(convertedValue);
		},
		[onValueChange, isValueInherited]
	);

	const handleToggleInheritance = React.useCallback(() => {
		onInheritChange?.(!isValueInherited, parentValue);
	}, [onInheritChange, isValueInherited, parentValue]);

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
			disabled={isValueInherited || selectProps.disabled}
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
						title={
							isValueInherited
								? `Unlink from parent (${parentValue})`
								: `Link to parent (${parentValue})`
						}
					>
						{isValueInherited ? (
							<LinkOffIcon className="h-3 w-3" />
						) : (
							<LinkIcon className="h-3 w-3" />
						)}
					</button>
				)}
			</div>
			<div className="group relative">
				{InputComponent}
				{isValueInherited && (
					<InheritanceActionOverlay
						variant={'full-overlay'}
						onUnlink={handleToggleInheritance}
						onNavigateToParent={onNavigateToParent}
					/>
				)}
			</div>
		</div>
	);
};

export interface TMappedSelectInputProps<GValue, GStateValue, GParentStateValue>
	extends Omit<SelectProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	// Value handling
	state: TState<GStateValue, any>;
	mapValue: (stateValue: GStateValue) => TReference<GValue> | undefined;
	onValueChange: (value: GValue | undefined) => void;

	// Parent/inheritance handling
	parentState?: TState<GParentStateValue, any>;
	mapParentValue?: (parentStateValue: GParentStateValue) => GValue | undefined;
	onInheritChange?: (shouldInherit: boolean, parentValue?: GValue) => void;
	onNavigateToParent?: () => void;
	disableFieldInheritance?: boolean;

	label: string;
	className?: string;
}

import { isInherited, resolveReference, TRef } from '@repo/editor';
import { Select, SelectProps, Text } from '@shopify/polaris';
import { useCombinedCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { TokenActionOverlay } from '@/features/page-editor';
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

	const { parentValue, displayValue, isValueInherited } = useCombinedCompute(
		[state, parentState ?? createState(undefined)],
		([current, parent]) => {
			const currentValue = mapValue(current.value);
			const parentValue = parent.value != null ? mapParentValue?.(parent.value) : undefined;
			const resolvedValue = resolveReference(currentValue, parentValue);
			return {
				currentValue,
				parentValue,
				resolvedValue,
				displayValue: String(resolvedValue),
				isValueInherited: isInherited(currentValue)
			};
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (isValueInherited) {
				return;
			}

			if (newValue === '') {
				onValueChange(undefined);
				return;
			}

			onValueChange(newValue as GValue);
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
					<TokenActionOverlay
						variant={'full-overlay'}
						onUnlink={handleToggleInheritance}
						onNavigateToToken={onNavigateToParent}
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
	mapValue: (stateValue: GStateValue) => TRef<GValue> | undefined;
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

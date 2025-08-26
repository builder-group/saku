import { isInherited, resolveReference, TRef } from '@repo/editor';
import { Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { InheritanceActionOverlay, LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const MappedTextInput = <GValue, GStateValue, GParentStateValue>(
	props: TMappedTextInputProps<GValue, GStateValue, GParentStateValue>
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
		min,
		max,
		className,
		...textFieldProps
	} = props;

	const [displayValue, setDisplayValue] = React.useState<string>('');
	const { parentValue, resolvedValue, isValueInherited } = useCombinedCompute(
		[state, parentState ?? createState(undefined)],
		([current, parent]) => {
			const currentValue = mapValue(current.value);
			const parentValue = parent.value != null ? mapParentValue?.(parent.value) : undefined;
			return {
				currentValue,
				parentValue,
				resolvedValue: resolveReference(currentValue, parentValue),
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
				setDisplayValue('');
				onValueChange(undefined);
				return;
			}

			if (textFieldProps.type === 'number') {
				const num = Number(newValue);
				if (!isNaN(num)) {
					let clampedNum = num;
					if (typeof min === 'number' && clampedNum < min) clampedNum = min;
					if (typeof max === 'number' && clampedNum > max) clampedNum = max;
					setDisplayValue(String(clampedNum));
					onValueChange(clampedNum as GValue);
					return;
				}

				setDisplayValue('');
				onValueChange(undefined);
				return;
			}

			setDisplayValue(newValue);
			onValueChange(newValue as GValue);
		},
		[isValueInherited, textFieldProps.type, onValueChange, min, max]
	);

	const handleToggleInheritance = React.useCallback(() => {
		onInheritChange?.(!isValueInherited, parentValue);
	}, [onInheritChange, isValueInherited, parentValue]);

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
			readOnly={isValueInherited}
			{...(textFieldProps.type === 'number' ? { min, max } : {})}
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

export interface TMappedTextInputProps<GValue, GStateValue, GParentStateValue>
	extends Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
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
	min?: number;
	max?: number;
	className?: string;
}

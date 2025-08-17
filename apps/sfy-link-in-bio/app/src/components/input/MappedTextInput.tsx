import { isInherited, resolveReference, TReference } from '@repo/editor';
import { Text, TextField, TextFieldProps, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const MappedTextInput = <GValue, GStateValue, GParentStateValue>(
	props: TMappedTextInputProps<GValue, GStateValue, GParentStateValue>
) => {
	const {
		state,
		mapValue,
		onValueChange,
		onInheritChange,
		parentState,
		mapParentValue,
		disableFieldInheritance = false,
		label,
		min,
		max,
		className,
		...textFieldProps
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

			let convertedValue: GValue | undefined = newValue as GValue;
			if (newValue === '') {
				convertedValue = undefined;
			} else if (textFieldProps.type === 'number') {
				let num = Number(newValue);
				if (typeof min === 'number' && num < min) num = min;
				if (typeof max === 'number' && num > max) num = max;
				convertedValue = num as GValue;
			}

			onValueChange(convertedValue);
		},
		[onValueChange, textFieldProps.type, isValueInherited, min, max]
	);

	const handleToggleInheritance = React.useCallback(() => {
		onInheritChange?.(!isValueInherited, parentValue);
	}, [onInheritChange, isValueInherited, parentValue]);

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
			<div className="relative">
				{isValueInherited ? (
					<Tooltip
						content={
							<span>
								This field is inherited from the parent. Click the unlink icon (
								<LinkOffIcon className="inline h-3 w-3" />) to set a custom value.
							</span>
						}
						preferredPosition="below"
						hoverDelay={500}
					>
						<div className="relative">
							{InputComponent}
							<div className="pointer-events-none absolute inset-y-0 right-0 z-50 flex items-center rounded-r-lg bg-[#F2F2F2] pr-1">
								<s-badge>Inherited</s-badge>
							</div>
						</div>
					</Tooltip>
				) : (
					InputComponent
				)}
			</div>
		</div>
	);
};

export interface TMappedTextInputProps<GValue, GStateValue, GParentStateValue>
	extends Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'labelHidden'> {
	// Value handling
	state: TState<GStateValue, any>;
	mapValue: (stateValue: GStateValue) => TReference<GValue> | undefined;
	onValueChange: (value: GValue | undefined) => void;

	// Parent/inheritance handling
	parentState?: TState<GParentStateValue, any>;
	mapParentValue?: (parentStateValue: GParentStateValue) => GValue | undefined;
	onInheritChange?: (shouldInherit: boolean, parentValue?: GValue) => void;
	disableFieldInheritance?: boolean;

	label: string;
	min?: number;
	max?: number;
	className?: string;
}

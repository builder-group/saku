import {
	hexToRgba,
	hsbaToRgba,
	isInherited,
	isValidHex,
	resolveReference,
	rgbaToHex,
	rgbaToHsba,
	TReference,
	TRgba
} from '@repo/editor';
import { ColorPicker, HSBAColor, Popover, Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { InheritanceActionOverlay, LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const MappedColorInput = <GStateValue, GParentStateValue>(
	props: TMappedColorInputProps<GStateValue, GParentStateValue>
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
		...textFieldProps
	} = props;

	const [popoverActive, setPopoverActive] = React.useState(false);

	const [displayValue, setDisplayValue] = React.useState('');
	const lastChangeFromText = React.useRef(false);
	const { parentValue, resolvedValue, isValueInherited, error } = useCombinedCompute(
		[state, parentState ?? createState(undefined)],
		([current, parent]) => {
			const currentValue = mapValue(current.value);
			const parentValue = parent.value != null ? mapParentValue?.(parent.value) : undefined;
			return {
				currentValue,
				parentValue,
				resolvedValue: resolveReference(currentValue, parentValue),
				isValueInherited: isInherited(currentValue),
				error: displayValue !== '' && displayValue !== 'Image' && !isValidHex(displayValue)
			};
		}
	);

	const pickerColor = React.useMemo(() => {
		if (resolvedValue == null) {
			return { hue: 0, saturation: 0, brightness: 1, alpha: 1 };
		}

		const hsba = rgbaToHsba(resolvedValue);
		return {
			hue: hsba.hue,
			saturation: hsba.saturation,
			brightness: hsba.brightness,
			alpha: hsba.alpha
		};
	}, [resolvedValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleValueChange = React.useCallback(
		(value: TRgba | undefined, fromText = false) => {
			lastChangeFromText.current = fromText;
			onValueChange(value);
		},
		[onValueChange]
	);

	const handleTextChange = React.useCallback(
		(newValue: string) => {
			if (isValueInherited) {
				return;
			}

			if (newValue === '') {
				setDisplayValue('');
				handleValueChange(undefined, true);
				return;
			}

			// Always enforce # prefix for non-empty values
			const normalizedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
			if (isValidHex(normalizedValue)) {
				handleValueChange(hexToRgba(normalizedValue), true);
			} else {
				handleValueChange(undefined, true);
			}
			setDisplayValue(normalizedValue);
		},
		[handleValueChange, isValueInherited]
	);

	const handleColorChange = React.useCallback(
		(hsba: HSBAColor) => {
			if (isValueInherited) {
				return;
			}

			handleValueChange(hsbaToRgba(hsba), false);
		},
		[handleValueChange, isValueInherited]
	);

	const handleToggleInheritance = React.useCallback(() => {
		onInheritChange?.(!isValueInherited, parentValue);
	}, [onInheritChange, isValueInherited, parentValue]);

	const togglePopoverActive = React.useCallback(() => {
		if (!isValueInherited) {
			setPopoverActive((active) => !active);
		}
	}, [isValueInherited]);

	const handleFocus = React.useCallback(() => {
		if (!isValueInherited) {
			setPopoverActive(true);
		}
	}, [isValueInherited]);

	// =========================================================================
	// Effects
	// =========================================================================

	React.useEffect(() => {
		if (!lastChangeFromText.current && resolvedValue != null) {
			setDisplayValue(rgbaToHex(resolvedValue));
		}
		lastChangeFromText.current = false;
	}, [resolvedValue]);

	// =========================================================================
	// UI
	// =========================================================================

	const InputComponent = (
		<Popover
			active={popoverActive}
			activator={
				<div className="relative">
					<TextField
						{...textFieldProps}
						label={label}
						labelHidden
						value={displayValue}
						onChange={handleTextChange}
						onFocus={handleFocus}
						readOnly={isValueInherited}
						prefix={
							<button
								type="button"
								onClick={togglePopoverActive}
								className={cn(
									'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200',
									!isValueInherited ? 'cursor-pointer' : 'cursor-default'
								)}
								style={{ backgroundColor: rgbaToHex(resolvedValue ?? { r: 0, g: 0, b: 0, a: 1 }) }}
							/>
						}
						autoComplete="off"
						error={error}
					/>
				</div>
			}
			onClose={togglePopoverActive}
			preferredAlignment="left"
			autofocusTarget="none"
		>
			<div className="max-w-64 p-4" onClick={(e) => e.stopPropagation()}>
				<ColorPicker onChange={handleColorChange} color={pickerColor} allowAlpha />
			</div>
		</Popover>
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
								? `Unlink from parent (${rgbaToHex(parentValue)})`
								: `Link to parent (${rgbaToHex(parentValue)})`
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

export interface TMappedColorInputProps<GStateValue, GParentStateValue>
	extends Omit<
		TextFieldProps,
		'value' | 'onChange' | 'label' | 'labelHidden' | 'prefix' | 'error'
	> {
	// Value handling
	state: TState<GStateValue, any>;
	mapValue: (stateValue: GStateValue) => TReference<TRgba> | undefined;
	onValueChange: (value: TRgba | undefined) => void;

	// Parent/inheritance handling
	parentState?: TState<GParentStateValue, any>;
	mapParentValue?: (parentStateValue: GParentStateValue) => TRgba | undefined;
	onInheritChange?: (shouldInherit: boolean, parentValue?: TRgba) => void;
	onNavigateToParent?: () => void;
	disableFieldInheritance?: boolean;

	label: string;
	className?: string;
}

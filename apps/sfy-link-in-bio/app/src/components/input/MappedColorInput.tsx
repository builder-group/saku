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
import {
	ColorPicker,
	HSBAColor,
	Popover,
	Text,
	TextField,
	TextFieldProps,
	Tooltip
} from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';

export const MappedColorInput = <GStateValue, GParentStateValue>(
	props: TMappedColorInputProps<GStateValue, GParentStateValue>
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
		className,
		...textFieldProps
	} = props;

	const [popoverActive, setPopoverActive] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');
	const lastChangeFromText = React.useRef(false);

	const currentValue = useCompute(state, ({ value }) => mapValue(value));
	const parentValue = useCompute(parentState, ({ value: parent }) =>
		parent != null ? mapParentValue?.(parent) : undefined
	);

	const isValueInherited = React.useMemo(() => isInherited(currentValue), [currentValue]);
	const resolvedValue = React.useMemo(
		() => resolveReference(currentValue, parentValue),
		[currentValue, parentValue]
	);

	const displayValue = React.useMemo(() => {
		const hex = resolvedValue != null ? rgbaToHex(resolvedValue) : '';
		if (!lastChangeFromText.current) {
			setInputValue(hex);
		}
		return hex;
	}, [resolvedValue]);

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

	const error = React.useMemo(() => {
		if (inputValue === '') {
			return false;
		}
		return !isValidHex(inputValue);
	}, [inputValue]);

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

			// Handle empty input
			if (newValue === '') {
				setInputValue('');
				handleValueChange(undefined, true);
				return;
			}

			// Always enforce # prefix for non-empty values
			const normalizedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
			setInputValue(normalizedValue);

			if (isValidHex(normalizedValue)) {
				handleValueChange(hexToRgba(normalizedValue), true);
			}
		},
		[handleValueChange, isValueInherited]
	);

	const handleColorChange = React.useCallback(
		(hsba: HSBAColor) => {
			if (isValueInherited) {
				return;
			}

			handleValueChange(hsbaToRgba(hsba));
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
									'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200',
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
	disableFieldInheritance?: boolean;

	label: string;
	className?: string;
}

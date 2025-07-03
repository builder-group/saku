import { TStyleReference } from '@repo/editor';
import { ColorPicker, HSBAColor, Popover, Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn, expandShortHex, hexToHsba, hsbaToHex, isValidHex } from '@/lib';

export const ColorStyleField = <GNodeValue, GParentNodeValue, GValue>(
	props: TColorStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
) => {
	const {
		label,
		node,
		parentNode,
		nodeValueMapper,
		parentValueMapper,
		nodeValueSetter,
		...textFieldProps
	} = props;

	const [popoverActive, setPopoverActive] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');

	const currentValue = useCompute(node, nodeValueMapper);
	const parentValue = useCompute(parentNode, (parent) =>
		parent != null ? parentValueMapper?.(parent) : undefined
	);
	const isInherited = React.useMemo(() => currentValue === 'inherit', [currentValue]);
	const displayValue = React.useMemo(() => {
		let value = '';
		if (isInherited && parentValue != null) {
			value = String(parentValue);
		} else if (currentValue != null && currentValue !== 'inherit') {
			value = String(currentValue);
		}
		setInputValue(value);
		return value;
	}, [currentValue, parentValue, isInherited]);

	const isInputValid = React.useMemo(() => {
		if (inputValue === '') {
			return true;
		}
		const normalizedValue = inputValue.startsWith('#') ? inputValue : `#${inputValue}`;
		return isValidHex(normalizedValue);
	}, [inputValue]);

	const pickerColor = React.useMemo(() => {
		return hexToHsba(expandShortHex(displayValue));
	}, [displayValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTextChange = React.useCallback(
		(newValue: string) => {
			if (isInherited) {
				return;
			}

			setInputValue(newValue);

			if (newValue === '') {
				nodeValueSetter(node, undefined);
				return;
			}

			const normalizedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
			if (isValidHex(normalizedValue)) {
				nodeValueSetter(node, normalizedValue as GValue);
			}
		},
		[node, nodeValueSetter, isInherited]
	);

	const handleColorChange = React.useCallback(
		(hsba: HSBAColor) => {
			if (isInherited) {
				return;
			}

			const { alpha, ...hsbColor } = hsba;
			const hexColor = hsbaToHex(hsbColor);
			nodeValueSetter(node, hexColor as GValue);
		},
		[node, nodeValueSetter, isInherited]
	);

	const handleToggleInheritance = React.useCallback(() => {
		if (parentValue == null) {
			return;
		}

		// Unsyncing: Set to parent value or undefined
		if (currentValue === 'inherit') {
			nodeValueSetter(node, parentValue);
		}
		// Syncing: Set to inherit
		else {
			nodeValueSetter(node, 'inherit' as GValue);
		}
	}, [node, nodeValueSetter, currentValue, parentValue]);

	const togglePopoverActive = React.useCallback(() => {
		if (!isInherited) {
			setPopoverActive((active) => !active);
		}
	}, [isInherited]);

	const handleFocus = React.useCallback(() => {
		if (!isInherited) {
			setPopoverActive(true);
		}
	}, [isInherited]);

	// =========================================================================
	// Effects
	// =========================================================================

	// Close color picker if field becomes inherited while open
	React.useEffect(() => {
		if (isInherited && popoverActive) {
			setPopoverActive(false);
		}
	}, [isInherited, popoverActive]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between">
				<Text as="span" variant="bodySm" tone="subdued">
					{label}
				</Text>
				{parentValue != null && (
					<button
						type="button"
						onClick={handleToggleInheritance}
						className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={
							isInherited
								? `Unlink from parent (${parentValue})`
								: `Link to parent (${parentValue})`
						}
					>
						{isInherited ? <LinkOffIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
					</button>
				)}
			</div>
			<Popover
				active={popoverActive}
				activator={
					<div className="relative">
						<TextField
							{...textFieldProps}
							label={label}
							labelHidden
							value={inputValue}
							onChange={handleTextChange}
							onFocus={handleFocus}
							readOnly={isInherited}
							prefix={
								<button
									type="button"
									onClick={togglePopoverActive}
									className={cn(
										'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200',
										!isInherited ? 'cursor-pointer' : 'cursor-default'
									)}
									style={{ backgroundColor: expandShortHex(displayValue) }}
								/>
							}
							autoComplete="off"
							error={!isInputValid}
						/>
					</div>
				}
				onClose={togglePopoverActive}
				preferredAlignment="left"
				autofocusTarget="none"
			>
				<div className="p-4" onClick={(e) => e.stopPropagation()}>
					<ColorPicker onChange={handleColorChange} color={pickerColor} allowAlpha={false} />
				</div>
			</Popover>
		</div>
	);
};

export interface TColorStyleFieldProps<GNodeValue, GParentNodeValue, GValue>
	extends Omit<
		TextFieldProps,
		'value' | 'onChange' | 'label' | 'labelHidden' | 'prefix' | 'error'
	> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TStyleReference<GValue> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends unknown ? GValue | undefined : TStyleReference<GValue>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => GValue | undefined;
}

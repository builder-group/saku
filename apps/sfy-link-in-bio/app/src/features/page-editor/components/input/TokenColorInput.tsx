import {
	hexToRgba,
	hsbaToRgba,
	isTokenRef,
	isValidHex,
	rgbaToHex,
	rgbaToHsba,
	TMixinTokenSet,
	tokenRef,
	TRef,
	TRgba
} from '@repo/editor';
import { ColorPicker, HSBAColor, Popover, Text, TextField, TextFieldProps } from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { cn } from '@/lib';
import { TokenActionOverlay } from './TokenActionOverlay';

export const TokenColorInput = <
	GValue extends TRgba,
	GRefValue extends TRef<GValue> | undefined,
	GTokenSet extends TMixinTokenSet
>(
	props: TTokenColorInputProps<GValue, GRefValue, GTokenSet>
) => {
	const {
		state,
		tokenSet,
		mapToTokenValue,
		onLinkChange,
		onNavigateToToken,
		disabledTokenLink = false,
		label,
		readOnly,
		className,
		...textFieldProps
	} = props;

	const [isPopoverActive, setIsPopoverActive] = React.useState(false);

	const [displayValue, setDisplayValue] = React.useState('');
	const lastChangeFromText = React.useRef(false);
	const resolvedValue = useCombinedCompute(
		[state, tokenSet ?? createState(undefined)],
		([{ value: stateValue }, { value: tokenMapValue }]) => {
			return isTokenRef(stateValue)
				? mapToTokenValue(stateValue.key, tokenMapValue)
				: (stateValue as GValue);
		},
		[mapToTokenValue],
		{
			isEqual(a, b) {
				return a?.r === b?.r && a?.g === b?.g && a?.b === b?.b && a?.a === b?.a;
			}
		}
	);
	const isLinked = useCompute(state, ({ value }) => isTokenRef(value));
	const isError = React.useMemo(() => {
		return displayValue !== '' && !isValidHex(displayValue);
	}, [displayValue]);

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
		(value: GRefValue, fromText = false) => {
			lastChangeFromText.current = fromText;
			if (value != null) {
				state.set(value);
			}
		},
		[state]
	);

	const handleTextChange = React.useCallback(
		(newValue: string) => {
			if (isLinked) {
				return;
			}

			if (newValue === '') {
				setDisplayValue('');
				return;
			}

			// Always enforce # prefix for non-empty values
			const normalizedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
			if (isValidHex(normalizedValue)) {
				handleValueChange(hexToRgba(normalizedValue) as GRefValue, true);
			}
			setDisplayValue(normalizedValue);
		},
		[handleValueChange, isLinked]
	);

	const handleColorChange = React.useCallback(
		(hsba: HSBAColor) => {
			if (isLinked) {
				return;
			}

			handleValueChange(hsbaToRgba(hsba) as GRefValue, false);
		},
		[handleValueChange, isLinked]
	);

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

	const togglePopoverActive = React.useCallback(() => {
		if (!isLinked) {
			setIsPopoverActive((active) => !active);
		}
	}, [isLinked]);

	const handleFocus = React.useCallback(() => {
		if (!isLinked) {
			setIsPopoverActive(true);
		}
	}, [isLinked]);

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
			active={isPopoverActive}
			activator={
				<div className="relative">
					<TextField
						{...textFieldProps}
						label={label}
						labelHidden
						value={displayValue}
						onChange={handleTextChange}
						onFocus={handleFocus}
						readOnly={isLinked || readOnly}
						prefix={
							<button
								type="button"
								onClick={togglePopoverActive}
								className={cn(
									'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200',
									isLinked ? 'cursor-default' : 'cursor-pointer'
								)}
								style={{ backgroundColor: rgbaToHex(resolvedValue ?? { r: 0, g: 0, b: 0, a: 1 }) }}
							/>
						}
						autoComplete="off"
						error={isError}
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
				{!disabledTokenLink && (
					<button
						type="button"
						onClick={handleToggleTokenLink}
						className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={isLinked ? `Unlink` : `Link`}
					>
						{isLinked ? <LinkOffIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
					</button>
				)}
			</div>
			<div className="group relative">
				{InputComponent}
				{isLinked && !disabledTokenLink && (
					<TokenActionOverlay
						variant={'full-overlay'}
						onUnlink={handleToggleTokenLink}
						onNavigateToToken={onNavigateToToken}
					/>
				)}
			</div>
		</div>
	);
};

export interface TTokenColorInputProps<
	GValue extends TRgba,
	GRefValue extends TRef<GValue> | undefined,
	GTokenSet extends TMixinTokenSet
> extends Omit<
		TextFieldProps,
		'label' | 'labelHidden' | 'value' | 'onChange' | 'onFocus' | 'prefix' | 'autoComplete' | 'error'
	> {
	state: TState<GRefValue, any>;

	tokenSet?: TState<GTokenSet, any>;
	mapToTokenValue: (tokenRef: string, tokenSet?: GTokenSet) => GValue | undefined;
	onLinkChange?: (isLinked: boolean) => { preventDefault: boolean } | void;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	label: string;
	className?: string;
}

import {
	hexToRgba,
	hsbaToRgba,
	isTokenRef,
	isValidHex,
	rgbaToHex,
	rgbaToHsba,
	TPaint,
	TRef,
	TToken
} from '@repo/editor';
import {
	ColorPicker,
	HSBAColor,
	Popover,
	Tabs,
	Text,
	TextField,
	TextFieldProps
} from '@shopify/polaris';
import { useCombinedCompute, useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { unwrapOrUndefined } from 'tuple-result';
import { ImageUploadField, LinkIcon, LinkOffIcon, TImageUploadEvent } from '@/components';
import { resolveTokenRef, TPageEditor } from '@/features/page-editor';
import { cn } from '@/lib';
import { isPreventDefault, TPreventDefault } from './prevent-default';
import { TokenActionOverlay } from './TokenActionOverlay';

export const TokenPaintInput = <GRefValue extends TRef<TPaint> | undefined>(
	props: TTokenPaintInputProps<GRefValue>
) => {
	const {
		state,
		tokenMap,
		onLinkToken,
		onUnlinkToken,
		onNavigateToToken,
		disabledTokenLink = false,
		editor,
		allowedPaintTypes = ['solid', 'image'],
		label,
		readOnly,
		className,
		...textFieldProps
	} = props;

	const [isPopoverActive, setIsPopoverActive] = React.useState(false);
	const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
	const tabs = React.useMemo(() => {
		const availableTabs = [];

		if (allowedPaintTypes.includes('solid')) {
			availableTabs.push({
				id: 'solid',
				content: 'Color',
				accessibilityLabel: 'Solid color paint',
				panelID: 'solid-panel'
			});
		}

		if (allowedPaintTypes.includes('image')) {
			availableTabs.push({
				id: 'image',
				content: 'Image',
				accessibilityLabel: 'Image paint',
				panelID: 'image-panel'
			});
		}

		return availableTabs;
	}, [allowedPaintTypes]);
	const tabValueCache = React.useRef<{
		solid?: TPaint;
		image?: TPaint;
	}>({});
	const currentTabId = React.useMemo(() => {
		return tabs[selectedTabIndex]?.id;
	}, [selectedTabIndex, tabs]);

	const [displayValue, setDisplayValue] = React.useState('');
	const lastChangeFromText = React.useRef(false);
	const resolvedValue = useCombinedCompute(
		[state, tokenMap],
		([stateCx, tokenMapCx]) => {
			if (stateCx.value == null) {
				return undefined;
			}
			const [isResolvedValue, , resolvedValue] = resolveTokenRef(stateCx.value, {
				tokenMap: tokenMapCx?.value
			});
			if (!isResolvedValue) {
				return undefined;
			}
			return resolvedValue;
		},
		[]
	);
	const isLinked = useCompute(state, ({ value }) => isTokenRef(value));
	const isError = React.useMemo(() => {
		return displayValue !== '' && displayValue !== 'Image' && !isValidHex(displayValue);
	}, [displayValue]);
	const isReadOnly = React.useMemo(() => {
		return resolvedValue?.type === 'image';
	}, [resolvedValue]);

	const pickerColor = React.useMemo(() => {
		if (resolvedValue?.type !== 'solid') {
			return { hue: 0, saturation: 0, brightness: 1, alpha: 1 };
		}

		const hsba = rgbaToHsba(resolvedValue.color);
		return {
			hue: hsba.hue,
			saturation: hsba.saturation,
			brightness: hsba.brightness,
			alpha: hsba.alpha
		};
	}, [resolvedValue]);

	const uploadFieldImage = React.useMemo(() => {
		if (resolvedValue?.type !== 'image') {
			return undefined;
		}

		const asset = editor.getImageAsset(resolvedValue.hash);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [resolvedValue, editor]);

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
				handleValueChange(
					{
						type: 'solid',
						color: hexToRgba(normalizedValue)
					} as GRefValue,
					true
				);
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

			handleValueChange(
				{
					type: 'solid',
					color: hsbaToRgba(hsba)
				} as GRefValue,
				false
			);
		},
		[handleValueChange, isLinked]
	);

	const handleImageChange = React.useCallback(
		(event: TImageUploadEvent) => {
			if (isLinked) {
				return;
			}

			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, event.fileName);
					if (hash != null) {
						handleValueChange(
							{
								type: 'image',
								hash,
								altText: event.fileName
							} as GRefValue,
							false
						);
					}
					break;
				}
				case 'Removed': {
					handleValueChange(
						{
							type: 'image'
						} as GRefValue,
						false
					);
					break;
				}
			}
		},
		[handleValueChange, isLinked, editor]
	);

	const handleToggleTokenLink = React.useCallback(() => {
		// Unlink token
		if (isLinked) {
			const result = onUnlinkToken?.();
			if (isPreventDefault(result)) {
				return;
			}
			const [isResolvedTokenOk, , tokenValue] = resolveTokenRef(state._v, {
				tokenMap: tokenMap?._v
			});
			if (isResolvedTokenOk && tokenValue != null) {
				state.set(tokenValue as GRefValue);
			}
			return;
		}

		// Link token
		const result = onLinkToken?.();
		if (isPreventDefault(result)) {
			return;
		}
		if (isTokenRef(result)) {
			state.set(result as GRefValue);
		}
	}, [onLinkToken, onUnlinkToken, isLinked, state, tokenMap]);

	const togglePopoverActive = React.useCallback(() => {
		if (!isLinked) {
			setIsPopoverActive((active) => {
				const newActive = !active;
				if (!newActive) {
					// Clear cache when popover closes
					tabValueCache.current = {};
				}
				return newActive;
			});
		}
	}, [isLinked]);

	const handleFocus = React.useCallback(() => {
		if (!isLinked) {
			setIsPopoverActive(true);
		}
	}, [isLinked]);

	const handleTabChange = React.useCallback(
		(newSelectedTabIndex: number) => {
			// Cache current value before switching
			if (resolvedValue != null) {
				switch (tabs[selectedTabIndex]?.id) {
					case 'solid':
						tabValueCache.current.solid = resolvedValue;
						break;
					case 'image':
						tabValueCache.current.image = resolvedValue;
						break;
					default:
					// do nothing
				}
			}

			setSelectedTabIndex(newSelectedTabIndex);

			// Apply cached value if available, otherwise use token value or default
			const tokenValue = unwrapOrUndefined(
				resolveTokenRef(state._v, {
					tokenMap: tokenMap?._v
				})
			);
			switch (tabs[newSelectedTabIndex]?.id) {
				case 'solid':
					handleValueChange(
						(tabValueCache.current.solid ||
							(tokenValue?.type === 'solid'
								? tokenValue
								: { type: 'solid', color: { r: 196, g: 196, b: 196, a: 1 } })) as GRefValue,
						false
					);
					break;
				case 'image':
					handleValueChange(
						(tabValueCache.current.image ||
							(tokenValue?.type === 'image'
								? tokenValue
								: {
										type: 'image'
									})) as GRefValue,
						false
					);
					break;
				default:
				// do nothing
			}
		},
		[handleValueChange, resolvedValue, selectedTabIndex, state, tabs, tokenMap]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	React.useEffect(() => {
		if (!lastChangeFromText.current && resolvedValue != null) {
			switch (resolvedValue.type) {
				case 'solid':
					setDisplayValue(rgbaToHex(resolvedValue.color));
					break;
				case 'image':
					setDisplayValue('Image');
					break;
				default:
				// do nothing
			}
		}
		lastChangeFromText.current = false;

		// Find the correct tab index based on the resolved value type
		const targetTabIndex = tabs.findIndex((tab) => tab.id === resolvedValue?.type);
		if (targetTabIndex !== -1) {
			setSelectedTabIndex(targetTabIndex);
		} else if (tabs.length > 0) {
			// Fallback to first available tab if current type is not allowed
			setSelectedTabIndex(0);
		}
	}, [resolvedValue, tabs]);

	// =========================================================================
	// UI
	// =========================================================================

	const ColorTab = <ColorPicker color={pickerColor} onChange={handleColorChange} allowAlpha />;
	const ImageTab = <ImageUploadField image={uploadFieldImage} onChange={handleImageChange} />;

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
						readOnly={isLinked || isReadOnly || readOnly}
						prefix={
							resolvedValue?.type === 'solid' ? (
								<button
									type="button"
									onClick={togglePopoverActive}
									className={cn(
										'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200',
										isLinked ? 'cursor-default' : 'cursor-pointer'
									)}
									style={{ backgroundColor: rgbaToHex(resolvedValue.color) }}
								/>
							) : resolvedValue?.type === 'image' ? (
								<button
									type="button"
									onClick={togglePopoverActive}
									className={cn(
										'-ml-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded border border-neutral-200',
										isLinked ? 'cursor-default' : 'cursor-pointer'
									)}
								>
									<img
										src={uploadFieldImage?.url}
										alt={resolvedValue.altText}
										className="h-full w-full object-cover"
									/>
								</button>
							) : null
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
			<div className="max-w-72 px-4 pb-4" onClick={(e) => e.stopPropagation()}>
				{tabs.length > 1 ? (
					<>
						{/* Offset 8px Tab padding which can't be removed */}
						<div className="-ml-2">
							<Tabs
								tabs={tabs}
								selected={selectedTabIndex}
								onSelect={handleTabChange}
								disabled={isLinked}
							/>
						</div>
						{currentTabId === 'solid' ? ColorTab : currentTabId === 'image' ? ImageTab : null}
					</>
				) : (
					<div className="pt-4">
						{currentTabId === 'solid' ? ColorTab : currentTabId === 'image' ? ImageTab : null}
					</div>
				)}
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

export interface TTokenPaintInputProps<GRefValue extends TRef<TPaint> | undefined>
	extends Omit<
		TextFieldProps,
		'label' | 'labelHidden' | 'value' | 'onChange' | 'onFocus' | 'prefix' | 'autoComplete' | 'error'
	> {
	state: TState<GRefValue, any>;

	tokenMap?: TState<Record<TToken['key'], TToken>, any>;
	onLinkToken?: () => GRefValue | TPreventDefault;
	onUnlinkToken?: () => void | TPreventDefault;
	onNavigateToToken?: () => void;
	disabledTokenLink?: boolean;

	editor: TPageEditor;
	allowedPaintTypes?: TTokenPaintInputPaintType[];

	label: string;
	className?: string;
}

export type TTokenPaintInputPaintType = 'solid' | 'image';

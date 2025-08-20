import {
	hexToRgba,
	hsbaToRgba,
	isInherited,
	isValidHex,
	resolveReference,
	rgbaToHex,
	rgbaToHsba,
	TAssetHash,
	TImageAsset,
	TPaint,
	TReference
} from '@repo/editor';
import {
	ColorPicker,
	HSBAColor,
	Popover,
	Tabs,
	Text,
	TextField,
	TextFieldProps,
	Tooltip
} from '@shopify/polaris';
import { ArrowRightIcon } from '@shopify/polaris-icons';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { Badge, ImageUploadField, LinkIcon, LinkOffIcon, TImageUploadEvent } from '@/components';
import { cn } from '@/lib';

export const MappedPaintInput = <GStateValue, GParentStateValue>(
	props: TMappedPaintInputProps<GStateValue, GParentStateValue>
) => {
	const {
		state,
		mapValue,
		onValueChange,
		onInheritChange,
		onInheritedBadgeClick,
		parentState,
		mapParentValue,
		disableFieldInheritance = false,
		editor,
		label,
		className,
		...textFieldProps
	} = props;

	const currentValue = useCompute(state, ({ value }) => mapValue(value));
	const parentValue = useCompute(parentState, ({ value: parent }) =>
		parent != null ? mapParentValue?.(parent) : undefined
	);
	const resolvedValue = React.useMemo(
		() => resolveReference(currentValue, parentValue),
		[currentValue, parentValue]
	);

	const isValueInherited = React.useMemo(() => isInherited(currentValue), [currentValue]);

	const [popoverActive, setPopoverActive] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');
	const [selectedTab, setSelectedTab] = React.useState(resolvedValue?.type === 'image' ? 1 : 0);
	const lastChangeFromText = React.useRef(false);

	// Cache values for each tab while popover is open
	const tabValueCache = React.useRef<{
		solid?: TPaint;
		image?: TPaint;
	}>({});

	const tabs = React.useMemo(
		() => [
			{
				id: 'solid',
				content: 'Color',
				accessibilityLabel: 'Solid color paint',
				panelID: 'solid-panel'
			},
			{
				id: 'image',
				content: 'Image',
				accessibilityLabel: 'Image paint',
				panelID: 'image-panel'
			}
		],
		[]
	);

	const { displayValue, isReadOnly } = React.useMemo(() => {
		let displayValue = '';
		let isReadOnly = false;
		switch (resolvedValue?.type) {
			case 'solid':
				displayValue = rgbaToHex(resolvedValue.color);
				break;
			case 'image':
				displayValue = 'Image';
				isReadOnly = true;
				break;
			default:
			// do nothing
		}
		if (!lastChangeFromText.current) {
			setInputValue(displayValue);
		}
		return { displayValue, isReadOnly };
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

	const error = React.useMemo(() => {
		if (inputValue === '') {
			return false;
		}

		switch (resolvedValue?.type) {
			case 'solid':
				return !isValidHex(inputValue);
			case 'image':
				return false;
			default:
				return false;
		}
	}, [inputValue, resolvedValue?.type]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleValueChange = React.useCallback(
		(value: TPaint | undefined, fromText = false) => {
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
				handleValueChange(
					{
						type: 'solid',
						color: hexToRgba(normalizedValue)
					},
					true
				);
			}
		},
		[handleValueChange, isValueInherited]
	);

	const handleColorChange = React.useCallback(
		(hsba: HSBAColor) => {
			if (isValueInherited) {
				return;
			}

			handleValueChange({
				type: 'solid',
				color: hsbaToRgba(hsba)
			});
		},
		[handleValueChange, isValueInherited]
	);

	const handleImageChange = React.useCallback(
		(event: TImageUploadEvent) => {
			if (isValueInherited) {
				return;
			}

			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, event.fileName);
					if (hash != null) {
						handleValueChange({
							type: 'image',
							hash,
							altText: event.fileName
						});
					}
					break;
				}
				case 'Removed': {
					handleValueChange({
						type: 'image'
					});
					break;
				}
			}
		},
		[handleValueChange, isValueInherited, editor]
	);

	const handleToggleInheritance = React.useCallback(() => {
		onInheritChange?.(!isValueInherited, parentValue);
	}, [onInheritChange, isValueInherited, parentValue]);

	const togglePopoverActive = React.useCallback(() => {
		if (!isValueInherited) {
			setPopoverActive((active) => {
				const newActive = !active;
				if (!newActive) {
					// Clear cache when popover closes
					tabValueCache.current = {};
				}
				return newActive;
			});
		}
	}, [isValueInherited]);

	const handleFocus = React.useCallback(() => {
		if (!isValueInherited) {
			setPopoverActive(true);
		}
	}, [isValueInherited]);

	const handleTabChange = React.useCallback(
		(selectedTabIndex: number) => {
			// Cache current value before switching
			if (resolvedValue != null) {
				if (selectedTab === 0) {
					tabValueCache.current.solid = resolvedValue;
				} else if (selectedTab === 1) {
					tabValueCache.current.image = resolvedValue;
				}
			}

			setSelectedTab(selectedTabIndex);

			switch (selectedTabIndex) {
				case 0:
					// Use cached value if available, otherwise use parent or default
					handleValueChange(
						tabValueCache.current.solid ||
							(parentValue?.type === 'solid'
								? parentValue
								: { type: 'solid', color: { r: 196, g: 196, b: 196, a: 1 } })
					);
					break;
				case 1:
					// Use cached value if available, otherwise use parent or default
					handleValueChange(
						tabValueCache.current.image ||
							(parentValue?.type === 'image'
								? parentValue
								: {
										type: 'image'
									})
					);
					break;
				default:
				// do nothing
			}
		},
		[handleValueChange, parentValue, resolvedValue, selectedTab]
	);

	// =========================================================================
	// UI
	// =========================================================================

	const ColorTab = <ColorPicker color={pickerColor} onChange={handleColorChange} allowAlpha />;

	const ImageTab = <ImageUploadField image={uploadFieldImage} onChange={handleImageChange} />;

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
						readOnly={isValueInherited || isReadOnly}
						prefix={
							resolvedValue?.type === 'solid' ? (
								<button
									type="button"
									onClick={togglePopoverActive}
									className={cn(
										'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200',
										!isValueInherited ? 'cursor-pointer' : 'cursor-default'
									)}
									style={{ backgroundColor: rgbaToHex(resolvedValue.color) }}
								/>
							) : resolvedValue?.type === 'image' ? (
								<button
									type="button"
									onClick={togglePopoverActive}
									className={cn(
										'-ml-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded border border-gray-200',
										!isValueInherited ? 'cursor-pointer' : 'cursor-default'
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
						error={error}
					/>
				</div>
			}
			onClose={togglePopoverActive}
			preferredAlignment="left"
			autofocusTarget="none"
		>
			<div className="max-w-72 px-4 pb-4" onClick={(e) => e.stopPropagation()}>
				<Tabs
					tabs={tabs}
					selected={selectedTab}
					onSelect={handleTabChange}
					disabled={isValueInherited}
				>
					{selectedTab === 0 ? ColorTab : selectedTab === 1 ? ImageTab : null}
				</Tabs>
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
						title={isValueInherited ? `Unlink from parent` : `Link to parent`}
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
								{onInheritedBadgeClick != null ? (
									<Badge asChild>
										<button
											type="button"
											onClick={onInheritedBadgeClick}
											className="group pointer-events-auto cursor-pointer"
										>
											Inherited
											<ArrowRightIcon className="hidden h-3 w-3 group-hover:block" />
										</button>
									</Badge>
								) : (
									<Badge>Inherited</Badge>
								)}
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

export interface TMappedPaintInputProps<GStateValue, GParentStateValue>
	extends Omit<
		TextFieldProps,
		'value' | 'onChange' | 'label' | 'labelHidden' | 'prefix' | 'error'
	> {
	// Value handling
	state: TState<GStateValue, any>;
	mapValue: (stateValue: GStateValue) => TReference<TPaint> | undefined;
	onValueChange: (value: TPaint | undefined) => void;

	// Parent/inheritance handling
	parentState?: TState<GParentStateValue, any>;
	mapParentValue?: (parentStateValue: GParentStateValue) => TPaint | undefined;
	onInheritChange?: (shouldInherit: boolean, parentValue?: TPaint) => void;
	onInheritedBadgeClick?: () => void;
	disableFieldInheritance?: boolean;

	editor: {
		registerImage: (url: string, fileName?: string) => TAssetHash | null;
		getImageAsset: (hash: TAssetHash | undefined | null) => TImageAsset | null;
	};

	label: string;
	className?: string;
}

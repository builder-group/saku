import {
	hexToRgba,
	hsbaToRgba,
	inherit,
	isInherited,
	isValidHex,
	resolveReference,
	rgbaToHex,
	rgbaToHsba,
	TImagePaint,
	TPaint,
	TReference,
	TSolidPaint
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
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { LinkIcon, LinkOffIcon } from '@/components';
import { ImageUploadField } from '@/components/input/ImageUploadField';
import { cn } from '@/lib';

export const PaintStyleField = <GNodeValue, GParentNodeValue>(
	props: TPaintStyleFieldProps<GNodeValue, GParentNodeValue>
) => {
	const {
		label,
		node,
		parentNode,
		nodeValueMapper,
		parentValueMapper,
		nodeValueSetter,
		className,
		...textFieldProps
	} = props;

	const [popoverActive, setPopoverActive] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');
	const [activeTab, setActiveTab] = React.useState(0);
	const lastChangeFromText = React.useRef(false);

	const currentValue = useCompute(node, ({ value }) => nodeValueMapper(value));
	const parentValue = useCompute(parentNode, ({ value: parent }) =>
		parent != null ? parentValueMapper?.(parent) : undefined
	);

	const isValueInherited = React.useMemo(() => isInherited(currentValue), [currentValue]);
	const resolvedValue = React.useMemo(
		() => resolveReference(currentValue, parentValue),
		[currentValue, parentValue]
	);

	const displayValue = React.useMemo(() => {
		if (resolvedValue?.type === 'solid') {
			const hex = rgbaToHex(resolvedValue.color);
			if (!lastChangeFromText.current) {
				setInputValue(hex);
			}
			return hex;
		}
		return '';
	}, [resolvedValue]);

	const pickerColor = React.useMemo(() => {
		if (resolvedValue?.type !== 'solid' || resolvedValue.color == null) {
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
		(value: Parameters<typeof nodeValueSetter>[1], fromText = false) => {
			lastChangeFromText.current = fromText;
			nodeValueSetter(node, value);
		},
		[node, nodeValueSetter]
	);

	const handleTextChange = React.useCallback(
		(newValue: string) => {
			if (isValueInherited) {
				return;
			}

			// Handle empty input
			if (newValue === '') {
				setInputValue('');
				handleValueChange(
					undefined as GParentNodeValue extends never ? TPaint | undefined : TReference<TPaint>,
					true
				);
				return;
			}

			// Always enforce # prefix for non-empty values
			const normalizedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
			setInputValue(normalizedValue);

			if (isValidHex(normalizedValue)) {
				const solidPaint: TSolidPaint = {
					type: 'solid',
					color: hexToRgba(normalizedValue)
				};
				handleValueChange(solidPaint, true);
			}
		},
		[handleValueChange, isValueInherited]
	);

	const handleColorChange = React.useCallback(
		(hsba: HSBAColor) => {
			if (isValueInherited) {
				return;
			}

			const solidPaint: TSolidPaint = {
				type: 'solid',
				color: hsbaToRgba(hsba)
			};
			handleValueChange(solidPaint);
		},
		[handleValueChange, isValueInherited]
	);

	const handleImageChange = React.useCallback(
		(image: {
			url: string;
			fileName?: string;
			width?: number;
			height?: number;
			previewImageUrl?: string;
		}) => {
			if (isValueInherited) {
				return;
			}

			// For now, we'll use a placeholder hash since we don't have the actual asset hash
			// In a real implementation, you'd need to get the actual asset hash from the uploaded image
			const imagePaint: TImagePaint = {
				type: 'image',
				hash: 'placeholder-hash', // TODO: Get actual asset hash
				altText: image.fileName
			};
			handleValueChange(imagePaint);
		},
		[handleValueChange, isValueInherited]
	);

	const handleToggleInheritance = React.useCallback(() => {
		if (parentValue == null) {
			return;
		}

		// Unsyncing: Set to parent value or undefined
		if (isValueInherited) {
			handleValueChange(parentValue);
		}
		// Syncing: Set to inherit
		else {
			handleValueChange(
				inherit() as GParentNodeValue extends never ? TPaint | undefined : TReference<TPaint>
			);
		}
	}, [handleValueChange, isValueInherited, parentValue]);

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

	const getPreviewContent = () => {
		if (resolvedValue?.type === 'image') {
			// Show image preview - you'll need to implement getting the actual image URL from hash
			return (
				<div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
					<span className="text-xs text-gray-500">IMG</span>
				</div>
			);
		}

		// Show color preview
		return (
			<div
				className="h-5 w-5 rounded-full border border-gray-200"
				style={{ backgroundColor: displayValue ?? undefined }}
			/>
		);
	};

	const InputComponent = (
		<Popover
			active={popoverActive}
			activator={
				<div className="relative">
					<TextField
						{...textFieldProps}
						label={label}
						labelHidden
						value={resolvedValue?.type === 'solid' ? inputValue : ''}
						onChange={handleTextChange}
						onFocus={handleFocus}
						readOnly={isValueInherited || resolvedValue?.type === 'image'}
						prefix={
							<button
								type="button"
								onClick={togglePopoverActive}
								className={cn(
									'-ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200',
									!isValueInherited ? 'cursor-pointer' : 'cursor-default'
								)}
							>
								{getPreviewContent()}
							</button>
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
			<div className="w-80 p-4" onClick={(e) => e.stopPropagation()}>
				<Tabs
					tabs={[
						{
							id: 'color',
							content: 'Color',
							accessibilityLabel: 'Color picker',
							panelID: 'color-panel'
						},
						{
							id: 'image',
							content: 'Image',
							accessibilityLabel: 'Image picker',
							panelID: 'image-panel'
						}
					]}
					selected={activeTab}
					onSelect={setActiveTab}
				>
					{activeTab === 0 && (
						<div className="pt-4">
							<ColorPicker onChange={handleColorChange} color={pickerColor} allowAlpha />
						</div>
					)}
					{activeTab === 1 && (
						<div className="pt-4">
							<ImageUploadField
								image={
									resolvedValue?.type === 'image'
										? {
												url: '', // TODO: Get actual URL from asset hash
												fileName: resolvedValue.altText
											}
										: undefined
								}
								onChange={handleImageChange}
							/>
						</div>
					)}
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
				{parentValue != null && (
					<button
						type="button"
						onClick={handleToggleInheritance}
						className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
						title={
							isValueInherited
								? `Unlink from parent (${parentValue.type === 'solid' ? rgbaToHex(parentValue.color) : 'image'})`
								: `Link to parent (${parentValue.type === 'solid' ? rgbaToHex(parentValue.color) : 'image'})`
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

export interface TPaintStyleFieldProps<GNodeValue, GParentNodeValue>
	extends Omit<
		TextFieldProps,
		'value' | 'onChange' | 'label' | 'labelHidden' | 'prefix' | 'error'
	> {
	label: string;
	node: TState<GNodeValue, []>;
	parentNode?: TState<GParentNodeValue, []>;
	nodeValueMapper: (value: GNodeValue) => TReference<TPaint> | undefined;
	nodeValueSetter: (
		node: TState<GNodeValue, []>,
		value: GParentNodeValue extends never ? TPaint | undefined : TReference<TPaint>
	) => void;
	parentValueMapper?: (parent: GParentNodeValue) => TPaint | undefined;
	className?: string;
}

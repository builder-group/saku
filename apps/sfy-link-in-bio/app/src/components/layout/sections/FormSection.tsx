import { Button, Text, TextField, TextFieldProps } from '@shopify/polaris';
import React from 'react';

export const FormSection: React.FC<TFormSectionProps> = (props) => {
	const {
		title,
		description,
		inputValue,
		helpText,
		buttonText = 'Save changes',
		disabled = false,
		onSubmit,
		...textFieldProps
	} = props;

	const [value, setValue] = React.useState(inputValue);
	const [isSaving, setIsSaving] = React.useState(false);
	const isSaveDisabled = React.useMemo(() => {
		return isSaving || disabled || !value || value === inputValue;
	}, [isSaving, disabled, value, inputValue]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleSubmit = React.useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (isSaveDisabled) {
				return;
			}

			setIsSaving(true);
			try {
				await onSubmit(value);
			} finally {
				setIsSaving(false);
			}
		},
		[isSaveDisabled, value, onSubmit]
	);

	const handleValueChange = React.useCallback((newValue: string) => {
		setValue(newValue);
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<form
			onSubmit={handleSubmit}
			className="overflow-hidden rounded-lg border border-gray-300 bg-white"
		>
			<div className="space-y-5 p-5 sm:p-8">
				<div className="space-y-3">
					<div>
						<Text as="h2" variant="headingMd">
							{title}
						</Text>
					</div>
					<div>
						<Text as="p" variant="bodySm" tone="subdued">
							{description}
						</Text>
					</div>
				</div>

				<div className="max-w-md">
					<TextField
						{...textFieldProps}
						label={textFieldProps.label ?? ''}
						labelHidden={textFieldProps.label == null}
						value={value}
						onChange={handleValueChange}
						disabled={disabled || isSaving}
						autoComplete="off"
					/>
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 border-t border-gray-300 bg-gray-50 px-5 py-3 sm:px-8">
				{helpText != null && (
					<div>
						<Text as="p" variant="bodySm" tone="subdued">
							{helpText}
						</Text>
					</div>
				)}
				<div className="ml-auto flex-shrink-0">
					<Button submit loading={isSaving} disabled={isSaveDisabled}>
						{buttonText}
					</Button>
				</div>
			</div>
		</form>
	);
};

interface TFormSectionProps
	extends Omit<TextFieldProps, 'label' | 'value' | 'onChange' | 'labelHidden' | 'autoComplete'> {
	title: string;
	description: string;
	inputValue: string;
	label?: string;
	helpText?: string;
	buttonText?: string;
	disabled?: boolean;
	onSubmit: (value: string) => Promise<void>;
}

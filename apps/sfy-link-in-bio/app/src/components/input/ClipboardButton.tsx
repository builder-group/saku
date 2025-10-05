import { useAppBridge } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris';
import React from 'react';
import { PolarisClipboardCheckIcon, PolarisClipboardIcon } from '../display';

export const ClipboardButton: React.FC<TProps> = (props) => {
	const { textToCopy, variant, ...buttonProps } = props;
	const [isCopied, setIsCopied] = React.useState(false);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const shopify = useAppBridge();

	const handleCopyToClipboard = React.useCallback(async () => {
		if (textToCopy == null || isDisabled) {
			return;
		}

		try {
			await navigator.clipboard.writeText(textToCopy);

			// Show success toast
			shopify.toast.show('Copied to clipboard!');

			// Update UI states
			setIsCopied(true);
			setIsDisabled(true);

			// Reset states after 2 seconds
			setTimeout(() => {
				setIsCopied(false);
				setIsDisabled(false);
			}, 2000);
		} catch (_) {
			// Show error toast
			shopify.toast.show('Failed to copy to clipboard', { isError: true });
		}
	}, [textToCopy, isDisabled, shopify]);

	return (
		<Button
			{...buttonProps}
			icon={isCopied ? PolarisClipboardCheckIcon : PolarisClipboardIcon}
			onClick={handleCopyToClipboard}
			disabled={isDisabled || buttonProps.disabled}
			variant={variant}
		/>
	);
};

interface TProps extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'icon'> {
	textToCopy: string;
	variant?: 'plain';
}

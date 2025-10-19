import { useAppBridge } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris';
import React from 'react';
import { PolarisClipboardCheckIcon, PolarisClipboardIcon } from '../display';

export const ClipboardButton: React.FC<TProps> = (props) => {
	const { textToCopy, ...buttonProps } = props;
	const [isCopied, setIsCopied] = React.useState(false);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const shopify = useAppBridge();

	const handleCopyToClipboard = React.useCallback(async () => {
		if (textToCopy == null || isDisabled) {
			return;
		}

		try {
			await navigator.clipboard.writeText(textToCopy);

			shopify.toast.show('Copied to clipboard!');

			setIsCopied(true);
			setIsDisabled(true);
			setTimeout(() => {
				setIsCopied(false);
				setIsDisabled(false);
			}, 2000);
		} catch (_) {
			shopify.toast.show('Failed to copy to clipboard', { isError: true });
		}
	}, [textToCopy, isDisabled, shopify]);

	return (
		<Button
			{...buttonProps}
			icon={isCopied ? PolarisClipboardCheckIcon : PolarisClipboardIcon}
			onClick={handleCopyToClipboard}
			disabled={isDisabled || buttonProps.disabled}
		/>
	);
};

interface TProps extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'icon'> {
	textToCopy: string;
}

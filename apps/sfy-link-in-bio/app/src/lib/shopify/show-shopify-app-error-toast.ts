import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { AppError } from '../AppError';
import { createSupportEmailUrl } from '../ui';

export function showShopifyAppErrorToast(message: string, error: AppError, shopify: ShopifyGlobal) {
	shopify.toast.show(message, {
		action: 'Contact support',
		onAction: () => {
			window.open(
				createSupportEmailUrl({
					error: AppError.fromFetchError(error),
					subjectPrefix: message
				}),
				'_blank'
			);
		},
		isError: true,
		duration: 5000
	});
}

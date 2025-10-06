import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import React from 'react';
import { useNavigate } from 'react-router';
import { coreApiClient, logger } from '@/environment';
import { createShopifyTokenMiddleware } from '@/lib';

export const ResetWorkspaceConfirmationModal: React.FC & {
	modalId: string;
} = () => {
	const shopifyBridge = useAppBridge();
	const navigate = useNavigate();
	const [isResetting, setIsResetting] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleConfirmReset = React.useCallback(async () => {
		setIsResetting(true);

		const [isResetOk, resetErr] = await coreApiClient.post('/v1/shopify/shop/reset', undefined, {
			requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
		});
		if (!isResetOk) {
			logger.error('Failed to reset settings:', resetErr);
			shopifyBridge.toast.show('Failed to reset settings. Please try again.', {
				isError: true,
				duration: 5000
			});
			setIsResetting(false);
			return;
		}

		// Success - redirect to onboarding
		navigate('/app/onboarding');
	}, [shopifyBridge, navigate]);

	const handleCancel = React.useCallback(() => {
		shopifyBridge.modal.hide(ResetWorkspaceConfirmationModal.modalId);
	}, [shopifyBridge]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<Modal id={ResetWorkspaceConfirmationModal.modalId}>
			<div className="p-4">
				<Text variant="bodyMd" as="p">
					This will permanently delete all your bio pages, settings, and data. You&apos;ll need to
					go through the setup process again. This action cannot be undone.
				</Text>
			</div>
			<TitleBar title="Reset app settings">
				<button
					variant="primary"
					tone="critical"
					onClick={handleConfirmReset}
					disabled={isResetting}
					loading={isResetting}
				>
					{isResetting ? 'Resetting...' : 'Reset settings'}
				</button>
				<button onClick={handleCancel} disabled={isResetting}>
					Cancel
				</button>
			</TitleBar>
		</Modal>
	);
};
ResetWorkspaceConfirmationModal.modalId = 'reset-workspace-confirmation-modal';

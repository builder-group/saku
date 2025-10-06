import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import React from 'react';
import { useNavigate } from 'react-router';
import { coreApiClient } from '@/environment';
import { useModalCommunication } from '@/hooks';
import { createShopifyTokenMiddleware } from '@/lib';

export const ResetWorkspaceConfirmationModal: React.FC & {
	modalId: string;
} = () => {
	const shopifyBridge = useAppBridge();
	const navigate = useNavigate();
	const [isResetting, setIsResetting] = React.useState(false);
	const { sendToParent } = useModalCommunication<TResetWorkspaceModalToParent>(
		ResetWorkspaceConfirmationModal.modalId
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleConfirmReset = React.useCallback(async () => {
		setIsResetting(true);
		sendToParent({ type: 'RESET_STARTED' });

		const [isResetOk, resetErr] = await coreApiClient.post('/v1/shopify/shop/reset', undefined, {
			requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
		});

		if (!isResetOk) {
			shopifyBridge.toast.show('Failed to reset settings. Please try again.', {
				isError: true,
				duration: 5000
			});
			sendToParent({ type: 'RESET_ERROR', error: resetErr });
			setIsResetting(false);
			return;
		}

		// Success - redirect to onboarding
		sendToParent({ type: 'RESET_SUCCESS' });
		shopifyBridge.toast.show('Settings reset successfully!');
		await navigate('/app/onboarding');
		setIsResetting(false);
	}, [shopifyBridge, navigate, sendToParent]);

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
				<button onClick={handleCancel}>Cancel</button>
			</TitleBar>
		</Modal>
	);
};
ResetWorkspaceConfirmationModal.modalId = 'reset-workspace-confirmation-modal';

export type TResetWorkspaceModalToParent =
	| { type: 'RESET_STARTED' }
	| { type: 'RESET_SUCCESS' }
	| { type: 'RESET_ERROR'; error: unknown };

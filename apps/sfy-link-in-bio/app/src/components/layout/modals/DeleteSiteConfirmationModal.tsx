import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import { NetworkError, RequestError } from 'feature-fetch';
import React from 'react';
import { coreApiClient } from '@/environment';
import { createShopifyTokenMiddleware } from '@/lib';
import { PageEditorModal } from './PageEditorModal';

export const DeleteSiteConfirmationModal: React.FC<TDeleteSiteConfirmationModalProps> & {
	modalId: string;
} = (props) => {
	const { siteId } = props;

	const shopifyBridge = useAppBridge();
	const [isDeleting, setIsDeleting] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleConfirmDelete = React.useCallback(async () => {
		setIsDeleting(true);

		const [isDeleteOk, deleteErr] = await coreApiClient.del('/v1/shopify/site/{siteId}', {
			pathParams: {
				siteId
			},
			requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
		});

		if (!isDeleteOk) {
			// Handle network errors
			if (deleteErr instanceof NetworkError) {
				shopifyBridge.toast.show(
					'Network connection issue. Please check your internet and try again.',
					{
						isError: true,
						duration: 5000
					}
				);
				setIsDeleting(false);
				return;
			}

			// Handle request errors
			if (deleteErr instanceof RequestError) {
				switch (deleteErr.status) {
					case 409:
						shopifyBridge.toast.show(
							'Cannot delete the last site in your workspace. At least one site must remain.',
							{
								isError: true,
								duration: 5000
							}
						);
						setIsDeleting(false);
						return;
					case 404:
						shopifyBridge.toast.show('Site not found.', {
							isError: true,
							duration: 5000
						});
						setIsDeleting(false);
						return;
					case 429:
						shopifyBridge.toast.show('Too many requests. Please wait a moment and try again.', {
							isError: true,
							duration: 5000
						});
						setIsDeleting(false);
						return;
				}
			}

			// Handle all other errors
			shopifyBridge.toast.show('Failed to delete site', {
				isError: true,
				duration: 5000
			});

			setIsDeleting(false);
			return;
		}

		shopifyBridge.toast.show('Site deleted successfully');
		await shopifyBridge.modal.hide(PageEditorModal.modalId(siteId));
		setIsDeleting(false);
	}, [siteId, shopifyBridge]);

	const handleCancelDelete = React.useCallback(() => {
		shopifyBridge.modal.hide(DeleteSiteConfirmationModal.modalId);
	}, [shopifyBridge]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<Modal id={DeleteSiteConfirmationModal.modalId}>
			<div className="p-4">
				<Text variant="bodyMd" as="p">
					This will permanently delete your site and all associated data. This action cannot be
					undone. Are you sure you want to continue?
				</Text>
			</div>
			<TitleBar title="Delete Site">
				<button
					variant="primary"
					tone="critical"
					onClick={handleConfirmDelete}
					disabled={isDeleting}
					loading={isDeleting}
				>
					{isDeleting ? 'Deleting...' : 'Delete Site'}
				</button>
				<button onClick={handleCancelDelete}>Cancel</button>
			</TitleBar>
		</Modal>
	);
};
DeleteSiteConfirmationModal.modalId = 'delete-site-confirmation-modal';

interface TDeleteSiteConfirmationModalProps {
	siteId: string;
}

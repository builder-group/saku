import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import { RequestError } from 'feature-fetch';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { useModalCommunication } from '@/hooks';
import { AppError, createShopifyTokenMiddleware, showShopifyAppErrorToast } from '@/lib';

export const DeleteSiteConfirmationModal: React.FC<TDeleteSiteConfirmationModalProps> & {
	modalId: (siteId: string) => string;
} = (props) => {
	const { cx } = props;

	const shopifyBridge = useAppBridge();
	const isOpen = useFeatureState(cx.isOpen);
	const isDeleting = useFeatureState(cx.isDeleting);

	const { sendToParent } = useModalCommunication<TDeleteSiteModalToParent>(
		DeleteSiteConfirmationModal.modalId(cx.siteId ?? 'unknown')
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleConfirmDelete = React.useCallback(async () => {
		if (cx.siteId == null) {
			return;
		}

		cx.isDeleting.set(true);
		sendToParent({ type: 'DELETE_STARTED' });

		const [isDeleteOk, deleteErr] = await coreApiClient.del('/v1/shopify/site/{siteId}', {
			pathParams: {
				siteId: cx.siteId
			},
			requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
		});
		if (!isDeleteOk) {
			const status = deleteErr instanceof RequestError ? deleteErr.status : undefined;
			switch (status) {
				case 409:
					shopifyBridge.toast.show(
						'Cannot delete the last site in your workspace. At least one site must remain.',
						{
							isError: true,
							duration: 5000
						}
					);
					break;
				case 404:
					shopifyBridge.toast.show('Site not found.', {
						isError: true,
						duration: 5000
					});
					break;
				default:
					showShopifyAppErrorToast(
						'Failed to delete site.',
						AppError.fromFetchError(deleteErr),
						shopifyBridge
					);
			}

			sendToParent({ type: 'DELETE_ERROR', error: deleteErr });
			cx._hooks.onDeleteError?.(AppError.fromFetchError(deleteErr));
			cx.isDeleting.set(false);
			return;
		}

		shopifyBridge.toast.show('Site deleted successfully');
		sendToParent({ type: 'DELETE_SUCCESS' });
		cx._hooks.onDeleteSuccess?.();
		cx.isOpen.set(false);
		cx.isDeleting.set(false);
	}, [sendToParent, shopifyBridge, cx]);

	// =========================================================================
	// UI
	// =========================================================================

	if (cx.siteId == null) {
		return null;
	}

	return (
		<Modal
			id={DeleteSiteConfirmationModal.modalId(cx.siteId)}
			open={isOpen}
			onHide={() => cx.isOpen.set(false)}
			onShow={() => cx.isOpen.set(true)}
		>
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
				<button onClick={() => cx.isOpen.set(false)}>Cancel</button>
			</TitleBar>
		</Modal>
	);
};
DeleteSiteConfirmationModal.modalId = (siteId: string) =>
	`delete-site-confirmation-modal-${siteId}`;

interface TDeleteSiteConfirmationModalProps {
	cx: TDeleteSiteModalCx;
}

export function useDeleteSiteModal(options: TUseDeleteSiteModalOptions = {}) {
	const { siteId, onDeleteSuccess, onDeleteError } = options;
	const cx = React.useMemo<TDeleteSiteModalCx>(() => {
		return {
			_hooks: {
				onDeleteSuccess,
				onDeleteError
			},
			siteId,
			isOpen: createState(false),
			isDeleting: createState(false),
			open(siteId?: string) {
				this.siteId = siteId;
				this.isOpen.set(true);
			}
		};
	}, [onDeleteSuccess, onDeleteError, siteId]);

	const ModalCallback = React.useCallback(() => {
		return <DeleteSiteConfirmationModal cx={cx} />;
	}, [cx]);

	return React.useMemo(
		() => ({
			cx,
			Modal: ModalCallback
		}),
		[cx, ModalCallback]
	);
}

interface TUseDeleteSiteModalOptions {
	siteId?: string;
	onDeleteSuccess?: () => void;
	onDeleteError?: (error: AppError) => void;
}

interface TDeleteSiteModalCx {
	_hooks: {
		onDeleteSuccess?: () => void;
		onDeleteError?: (error: AppError) => void;
	};
	siteId?: string;
	isOpen: TState<boolean, []>;
	isDeleting: TState<boolean, []>;
	open: (siteId: string) => void;
}

export type TDeleteSiteModalToParent =
	| { type: 'DELETE_STARTED' }
	| { type: 'DELETE_SUCCESS' }
	| { type: 'DELETE_ERROR'; error: unknown };

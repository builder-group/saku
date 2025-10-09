import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import {
	DeleteSiteConfirmationModal,
	PageEditorModal,
	TDeleteSiteModalToParent
} from '@/components';
import { useParentCommunication } from '@/hooks';

export const DeleteSiteSection: React.FC<TDeleteSiteSectionProps> = (props) => {
	const { siteId, title, description, buttonText = 'Delete Site' } = props;

	const shopifyBridge = useAppBridge();
	const [deleteState, setDeleteState] = React.useState<'idle' | 'loading' | 'success' | 'error'>(
		'idle'
	);

	useParentCommunication<TDeleteSiteModalToParent>(DeleteSiteConfirmationModal.modalId(siteId), {
		onModalMessage: React.useCallback(
			(message: TDeleteSiteModalToParent) => {
				switch (message.type) {
					case 'DELETE_STARTED':
						setDeleteState('loading');
						break;
					case 'DELETE_SUCCESS':
						shopifyBridge.modal.hide(PageEditorModal.modalId(siteId));
						setDeleteState('success');
						break;
					case 'DELETE_ERROR':
						setDeleteState('error');
						break;
				}
			},
			[shopifyBridge, siteId]
		),
		inMaxModal: true
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleDeleteClick = React.useCallback(() => {
		setDeleteState('idle');
		shopifyBridge.modal.show(DeleteSiteConfirmationModal.modalId(siteId));
	}, [shopifyBridge, siteId]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="overflow-hidden rounded-lg border border-red-500 bg-white">
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
			</div>

			<div className="flex items-center justify-end border-t border-red-500 bg-neutral-50 px-5 py-3 sm:px-8">
				<div className="flex-shrink-0">
					<Button
						tone="critical"
						onClick={handleDeleteClick}
						loading={deleteState === 'loading'}
						disabled={deleteState === 'loading'}
					>
						{deleteState === 'loading' ? 'Deleting...' : buttonText}
					</Button>
				</div>
			</div>
		</div>
	);
};

interface TDeleteSiteSectionProps {
	siteId: string;
	title: string;
	description: string;
	buttonText?: string;
}

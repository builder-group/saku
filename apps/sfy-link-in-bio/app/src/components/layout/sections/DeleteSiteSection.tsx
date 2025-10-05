import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text } from '@shopify/polaris';
import React from 'react';

export const DeleteSiteSection: React.FC<TDeleteSiteSectionProps> = (props) => {
	const {
		title,
		description,
		modalTitle,
		modalDescription,
		buttonText = 'Delete Site',
		onDelete
	} = props;

	const shopifyBridge = useAppBridge();
	const [isDeleting, setIsDeleting] = React.useState(false);
	const modalId = React.useId();

	// =========================================================================
	// Events
	// =========================================================================

	const handleDeleteClick = React.useCallback(() => {
		shopifyBridge.modal.show(modalId);
	}, [shopifyBridge, modalId]);

	const handleConfirmDelete = React.useCallback(async () => {
		setIsDeleting(true);
		try {
			await onDelete();
		} finally {
			setIsDeleting(false);
		}
	}, [onDelete]);

	const handleCancelDelete = React.useCallback(() => {
		shopifyBridge.modal.hide(modalId);
	}, [shopifyBridge, modalId]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
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
						<Button tone="critical" onClick={handleDeleteClick} disabled={isDeleting}>
							{buttonText}
						</Button>
					</div>
				</div>
			</div>

			{/* Confirmation Modal */}
			<Modal id={modalId}>
				<div className="p-4">
					<Text variant="bodyMd" as="p">
						{modalDescription}
					</Text>
				</div>
				<TitleBar title={modalTitle}>
					<button
						variant="primary"
						tone="critical"
						onClick={handleConfirmDelete}
						disabled={isDeleting}
						loading={isDeleting}
					>
						{buttonText}
					</button>
					<button onClick={handleCancelDelete} disabled={isDeleting}>
						Cancel
					</button>
				</TitleBar>
			</Modal>
		</>
	);
};

interface TDeleteSiteSectionProps {
	title: string;
	description: string;
	modalTitle: string;
	modalDescription: string;
	buttonText?: string;
	onDelete: () => Promise<void>;
}

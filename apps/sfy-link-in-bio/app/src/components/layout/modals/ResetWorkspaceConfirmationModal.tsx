import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import React from 'react';

export const ResetWorkspaceConfirmationModal: React.FC<TResetWorkspaceConfirmationModalProps> & {
	modalId: string;
} = (props) => {
	const { handleConfirm, handleCancel, isResetting } = props;

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
					onClick={handleConfirm}
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

interface TResetWorkspaceConfirmationModalProps {
	handleConfirm: () => void;
	handleCancel: () => void;
	isResetting: boolean;
}

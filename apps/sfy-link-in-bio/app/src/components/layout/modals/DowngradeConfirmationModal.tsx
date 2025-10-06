import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import React from 'react';

export const DowngradeConfirmationModal: React.FC<TDowngradeConfirmationModalProps> & {
	modalId: string;
} = (props) => {
	const { handleConfirm, handleCancel, pendingDowngradePlanName, isDowngrading } = props;

	return (
		<Modal id={DowngradeConfirmationModal.modalId}>
			<div className="p-4">
				<Text variant="bodyMd" as="p">
					You&apos;re about to downgrade to the <strong>{pendingDowngradePlanName}</strong> plan.
					This change will take effect immediately.
				</Text>
				<br />
				<Text variant="bodyMd" as="p">
					You&apos;ll lose access to premium features right away.
				</Text>
			</div>
			<TitleBar title="Confirm Plan Downgrade">
				<button
					variant="primary"
					tone="critical"
					onClick={handleConfirm}
					disabled={isDowngrading}
					loading={isDowngrading}
				>
					{isDowngrading ? 'Downgrading...' : 'Downgrade Plan'}
				</button>
				<button onClick={handleCancel}>Cancel</button>
			</TitleBar>
		</Modal>
	);
};
DowngradeConfirmationModal.modalId = 'downgrade-confirmation-modal';

interface TDowngradeConfirmationModalProps {
	handleConfirm: () => void;
	handleCancel: () => void;
	pendingDowngradePlanName?: string;
	isDowngrading: boolean;
}

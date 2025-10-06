import { shortId } from '@blgc/utils';
import { useAppBridge } from '@shopify/app-bridge-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { ResetWorkspaceConfirmationModal, useCrisp } from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { createShopifyTokenMiddleware } from '../../lib';

// https://shopify.dev/docs/api/app-home/patterns/settings
const Page: React.FC = () => {
	const crisp = useCrisp();
	const shopifyBridge = useAppBridge();
	const navigate = useNavigate();
	const [isResetting, setIsResetting] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleResetSettings = React.useCallback(() => {
		shopifyBridge.modal.show(ResetWorkspaceConfirmationModal.modalId);
	}, [shopifyBridge]);

	const handleConfirmReset = React.useCallback(async () => {
		setIsResetting(true);

		const [isResetOk] = await coreApiClient.post('/v1/shopify/shop/reset', undefined, {
			requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
		});

		if (!isResetOk) {
			shopifyBridge.toast.show('Failed to reset settings. Please try again.', {
				isError: true,
				duration: 5000
			});
			setIsResetting(false);
			return;
		}

		// Success - redirect to onboarding
		shopifyBridge.toast.show('Settings reset successfully!');
		await navigate('/app/onboarding');
		shopifyBridge.modal.hide(ResetWorkspaceConfirmationModal.modalId);
		setIsResetting(false);
	}, [navigate, shopifyBridge]);

	const handleCancelReset = React.useCallback(() => {
		shopifyBridge.modal.hide(ResetWorkspaceConfirmationModal.modalId);
	}, [shopifyBridge]);

	const handleStartChat = React.useCallback(() => {
		crisp?.openChat();
		crisp?.startThread(`app-settings_${shortId()}`);
	}, [crisp]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<s-page inlineSize="small">
				<ui-title-bar title="Settings"></ui-title-bar>

				<div className="mt-4 grid grid-cols-1 gap-4 bg-[var(--p-color-bg)]">
					{/* Account */}
					<s-section heading="Account">
						<div className="overflow-hidden rounded-lg border border-neutral-200">
							<s-clickable
								padding="small-100"
								href="/app/settings/plans?from=settings"
								accessibilityLabel="View pricing plans and upgrade options"
							>
								<div className="grid grid-cols-[1fr_auto] items-center gap-4">
									<div>
										<s-heading>View plans</s-heading>
										<s-paragraph color="subdued">
											Check out our pricing and upgrade options
										</s-paragraph>
									</div>
									<s-icon type="chevron-right"></s-icon>
								</div>
							</s-clickable>
						</div>
					</s-section>

					{/* Help & Resources */}
					<s-section heading="Help & Resources">
						<div className="overflow-hidden rounded-lg border border-neutral-200">
							{/* Quick Chat */}
							<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
								<div>
									<s-heading>Chat with us</s-heading>
									<s-paragraph color="subdued">Get quick help via chat</s-paragraph>
								</div>
								<s-button variant="primary" onClick={handleStartChat}>
									Start Chat
								</s-button>
							</div>
							<div className="px-4">
								<s-divider></s-divider>
							</div>
							{/* Discord Community */}
							<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
								<div>
									<s-heading>Discord Community</s-heading>
									<s-paragraph color="subdued">Join our community for help and updates</s-paragraph>
								</div>
								<s-button variant="secondary" href={appConfig.help.discord} target="_blank">
									Join
								</s-button>
							</div>
							<div className="px-4">
								<s-divider></s-divider>
							</div>
							{/* Full Help Page */}
							<s-clickable
								padding="small-100"
								href="/app/help?from=settings"
								accessibilityLabel="View comprehensive help, documentation and system information"
							>
								<div className="grid grid-cols-[1fr_auto] items-center gap-4">
									<div>
										<s-heading>Help & Resources</s-heading>
										<s-paragraph color="subdued">
											Get help, view docs, legal documents, system status, and more
										</s-paragraph>
									</div>
									<s-icon type="chevron-right"></s-icon>
								</div>
							</s-clickable>
						</div>
					</s-section>

					{/* Danger Zone */}
					<s-section heading="Danger Zone">
						<div className="overflow-hidden rounded-lg border border-neutral-200">
							<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
								<div>
									<s-heading>Reset app settings</s-heading>
									<s-paragraph color="subdued">
										Reset all settings to their default values. This action cannot be undone.
									</s-paragraph>
								</div>
								<s-button
									tone="critical"
									onClick={handleResetSettings}
									loading={isResetting}
									disabled={isResetting}
								>
									{isResetting ? 'Resetting...' : 'Reset'}
								</s-button>
							</div>
						</div>
					</s-section>
				</div>
			</s-page>

			<ResetWorkspaceConfirmationModal
				handleConfirm={handleConfirmReset}
				handleCancel={handleCancelReset}
				isResetting={isResetting}
			/>
		</>
	);
};

export default Page;

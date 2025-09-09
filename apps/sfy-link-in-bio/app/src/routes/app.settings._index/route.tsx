import { shortId } from '@blgc/utils';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import React from 'react';
import { useNavigate } from 'react-router';
import { useCrisp } from '@/components';
import { appConfig, coreApiClient, logger } from '@/environment';
import { createShopifyTokenMiddleware } from '@/lib';

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
		shopifyBridge.modal.show('reset-confirmation-modal');
	}, [shopifyBridge]);

	const handleConfirmReset = React.useCallback(async () => {
		setIsResetting(true);

		const result = await coreApiClient.post('/v1/shopify/shop/reset', undefined, {
			requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
		});
		if (result.isErr()) {
			logger.error('Failed to reset settings:', result.error);
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

	const handleStartChat = React.useCallback(() => {
		crisp?.openChat();
		crisp?.startThread(`app-settings_${shortId()}`);
	}, [crisp]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<form data-save-bar>
				<s-page inlineSize="small">
					<ui-title-bar title="Settings"></ui-title-bar>

					{/* Account */}
					<s-section heading="Account">
						<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
							<s-clickable
								padding="small-100"
								href="/app/settings/plans"
								accessibilityLabel="View pricing plans and upgrade options"
							>
								<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
									<s-box>
										<s-heading>View plans</s-heading>
										<s-paragraph color="subdued">
											Check out our pricing and upgrade options
										</s-paragraph>
									</s-box>
									<s-icon type="chevron-right"></s-icon>
								</s-grid>
							</s-clickable>
						</s-stack>
					</s-section>

					{/* Help & Resources */}
					<s-section heading="Help & Resources">
						<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
							{/* Quick Chat */}
							<s-box padding="small-100">
								<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
									<s-box>
										<s-heading>Chat with us</s-heading>
										<s-paragraph color="subdued">Get quick help via chat</s-paragraph>
									</s-box>
									<s-button variant="primary" onClick={handleStartChat}>
										Start Chat
									</s-button>
								</s-grid>
							</s-box>
							<s-box paddingInline="small-100">
								<s-divider></s-divider>
							</s-box>
							{/* Discord Community */}
							<s-box padding="small-100">
								<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
									<s-box>
										<s-heading>Discord Community</s-heading>
										<s-paragraph color="subdued">
											Join our community for help and updates
										</s-paragraph>
									</s-box>
									<s-button variant="secondary" href={appConfig.social.discord} target="_blank">
										Join
									</s-button>
								</s-grid>
							</s-box>
							<s-box paddingInline="small-100">
								<s-divider></s-divider>
							</s-box>
							{/* Full Help Page */}
							<s-clickable
								padding="small-100"
								href="/app/help?from=settings"
								accessibilityLabel="View comprehensive help, documentation and system information"
							>
								<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
									<s-box>
										<s-heading>Help & Resources</s-heading>
										<s-paragraph color="subdued">
											Get help, view docs, legal documents, system status, and more
										</s-paragraph>
									</s-box>
									<s-icon type="chevron-right"></s-icon>
								</s-grid>
							</s-clickable>
						</s-stack>
					</s-section>

					{/* Danger Zone */}
					<s-section heading="Danger Zone">
						<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
							<s-box padding="small-100">
								<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
									<s-box>
										<s-heading>Reset app settings</s-heading>
										<s-paragraph color="subdued">
											Reset all settings to their default values. This action cannot be undone.
										</s-paragraph>
									</s-box>
									<s-button
										tone="critical"
										onClick={handleResetSettings}
										loading={isResetting}
										disabled={isResetting}
									>
										Reset
									</s-button>
								</s-grid>
							</s-box>
						</s-stack>
					</s-section>
				</s-page>
			</form>
			{/* Reset Confirmation Modal */}
			<Modal id="reset-confirmation-modal">
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
						Reset settings
					</button>
					<button onClick={() => shopifyBridge.modal.hide('reset-confirmation-modal')}>
						Cancel
					</button>
				</TitleBar>
			</Modal>
		</>
	);
};

export default Page;

import { Crisp } from 'crisp-sdk-web';
import React from 'react';
import { appConfig } from '@/environment';

// https://shopify.dev/docs/api/app-home/patterns/settings
const Page: React.FC = () => {
	const handleResetSettings = React.useCallback(() => {
		// TODO: Implement reset settings functionality
		console.log('Reset settings clicked');
	}, []);

	const handleStartChat = React.useCallback(() => {
		Crisp.chat.open();
	}, []);

	return (
		<form data-save-bar>
			<s-page inlineSize="small">
				<ui-title-bar title="Settings"></ui-title-bar>

				{/* App Management */}
				<s-section heading="App Management">
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
						<s-box paddingInline="small-100">
							<s-divider></s-divider>
						</s-box>
						<s-clickable
							padding="small-100"
							href="/app/settings/system"
							accessibilityLabel="View system information and app status"
						>
							<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
								<s-box>
									<s-heading>System Information</s-heading>
									<s-paragraph color="subdued">
										App version, API status, and system details
									</s-paragraph>
								</s-box>
								<s-icon type="chevron-right"></s-icon>
							</s-grid>
						</s-clickable>
					</s-stack>
				</s-section>

				{/* Get Help */}
				<s-section heading="Get Help">
					<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
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
						<s-box padding="small-100">
							<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
								<s-box>
									<s-heading>Discord Community</s-heading>
									<s-paragraph color="subdued">Join our community for help and updates</s-paragraph>
								</s-box>
								<s-button variant="secondary" href={appConfig.social.discord} target="_blank">
									Join
								</s-button>
							</s-grid>
						</s-box>
						<s-box paddingInline="small-100">
							<s-divider></s-divider>
						</s-box>
						<s-box padding="small-100">
							<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
								<s-box>
									<s-heading>Email Support</s-heading>
									<s-paragraph color="subdued">{appConfig.support.email}</s-paragraph>
								</s-box>
								<s-button
									variant="secondary"
									href={`mailto:${appConfig.support.email}`}
									target="_blank"
								>
									Contact
								</s-button>
							</s-grid>
						</s-box>
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
								<s-button tone="critical" onClick={handleResetSettings}>
									Reset
								</s-button>
							</s-grid>
						</s-box>
					</s-stack>
				</s-section>

				{/* Legal & Compliance */}
				<s-section heading="Legal & Compliance">
					<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
						<s-clickable
							padding="small-100"
							href={appConfig.legal.privacy}
							target="_blank"
							accessibilityLabel="View privacy policy in new tab"
						>
							<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
								<s-box>
									<s-heading>Privacy Policy</s-heading>
									<s-paragraph color="subdued">
										How we collect, use, and protect your data
									</s-paragraph>
								</s-box>
								<s-icon type="arrow-up-right"></s-icon>
							</s-grid>
						</s-clickable>
						<s-box paddingInline="small-100">
							<s-divider></s-divider>
						</s-box>
						<s-clickable
							padding="small-100"
							href={appConfig.legal.terms}
							target="_blank"
							accessibilityLabel="View terms of service in new tab"
						>
							<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
								<s-box>
									<s-heading>Terms of Service</s-heading>
									<s-paragraph color="subdued">Terms and conditions for using Saku</s-paragraph>
								</s-box>
								<s-icon type="arrow-up-right"></s-icon>
							</s-grid>
						</s-clickable>
					</s-stack>
				</s-section>
			</s-page>
		</form>
	);
};

export default Page;

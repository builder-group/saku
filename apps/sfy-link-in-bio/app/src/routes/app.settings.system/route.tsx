import React from 'react';
import { appConfig } from '@/environment';

const Page: React.FC = () => {
	return (
		<s-page inlineSize="small">
			<ui-title-bar title="System Information"></ui-title-bar>

			{/* Back Button */}
			<s-box paddingBlock="small-100" paddingInline="none">
				<s-button variant="tertiary" href="/app/settings" icon="arrow-left">
					Back to Settings
				</s-button>
			</s-box>

			{/* App Details */}
			<s-section heading="App Details">
				<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
					<s-box padding="small-100">
						<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
							<s-box>
								<s-heading>App Version</s-heading>
								<s-paragraph color="subdued">Current running version</s-paragraph>
							</s-box>
							<s-badge tone="info">{appConfig.version}</s-badge>
						</s-grid>
					</s-box>
					<s-box paddingInline="small-100">
						<s-divider></s-divider>
					</s-box>
					<s-box padding="small-100">
						<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
							<s-box>
								<s-heading>API Status</s-heading>
								<s-paragraph color="subdued">Backend service health</s-paragraph>
							</s-box>
							<s-badge tone="success">Healthy</s-badge>
						</s-grid>
					</s-box>
				</s-stack>
			</s-section>
		</s-page>
	);
};

export default Page;

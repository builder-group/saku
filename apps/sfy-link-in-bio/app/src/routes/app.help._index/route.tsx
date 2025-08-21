import { Crisp } from 'crisp-sdk-web';
import React from 'react';
import { useSearchParams } from 'react-router';
import { AccordionSection } from '@/components';
import { appConfig } from '@/environment';

const Page: React.FC = () => {
	const [searchParams] = useSearchParams();
	const fromSettings = React.useMemo(() => searchParams.get('from') === 'settings', [searchParams]);

	const handleStartChat = React.useCallback(() => {
		Crisp.chat.open();
	}, []);

	return (
		<s-page inlineSize="small">
			<ui-title-bar title="Help & Resources"></ui-title-bar>

			{/* Back Button - Show when coming from settings */}
			{fromSettings && (
				<s-box paddingBlock="small-100" paddingInline="none">
					<s-button variant="tertiary" href="/app/settings" icon="arrow-left">
						Back to Settings
					</s-button>
				</s-box>
			)}

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

			{/* Documentation */}
			<s-section heading="Documentation">
				<s-stack gap="none" border="base" borderRadius="base" overflow="hidden">
					<s-clickable
						padding="small-100"
						href="https://youtu.be/I88GWORGmvU"
						target="_blank"
						accessibilityLabel="Watch quick walkthrough video in new tab"
					>
						<s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
							<s-box>
								<s-heading>Quick Walkthrough</s-heading>
								<s-paragraph color="subdued">
									Watch our 5-minute video guide to get started
								</s-paragraph>
							</s-box>
							<s-icon type="arrow-up-right"></s-icon>
						</s-grid>
					</s-clickable>
				</s-stack>
			</s-section>

			{/* FAQ */}
			<s-section heading="Frequently Asked Questions">
				<div className="overflow-hidden rounded-lg border border-neutral-200">
					<AccordionSection title="How do I get started with my link-in-bio?" defaultOpen={false}>
						<p className="text-sm text-neutral-600">
							After installing Saku, you'll be guided through a simple setup process. You can
							customize your colors, add your links, and publish your bio page in just a few
							minutes.
						</p>
					</AccordionSection>
					<AccordionSection
						title="Can I customize the appearance of my bio page?"
						defaultOpen={false}
					>
						<p className="text-sm text-neutral-600">
							Yes! You can customize colors, fonts, layout, and more. Free users get basic
							customization options, while Awesome plan users get advanced customization features.
						</p>
					</AccordionSection>
					<AccordionSection title="How do I track clicks and conversions?" defaultOpen={false}>
						<p className="text-sm text-neutral-600">
							All plans include basic analytics. You can see click counts, popular links, and
							visitor insights directly in your Saku dashboard.
						</p>
					</AccordionSection>
					<AccordionSection
						title="What's the difference between Free and Awesome plans?"
						defaultOpen={false}
					>
						<p className="text-sm text-neutral-600">
							Free plan includes basic features and a "Powered by Saku" watermark. Awesome plan
							removes the watermark, provides priority support, advanced customization, and helps
							sustain Saku development.
						</p>
					</AccordionSection>
					<AccordionSection title="How do I change or cancel my plan?" defaultOpen={false}>
						<p className="text-sm text-neutral-600">
							You can manage your subscription from the Plans page in Settings. Upgrades take effect
							immediately, while downgrades apply at the next billing cycle. You can cancel anytime.
						</p>
					</AccordionSection>
					<AccordionSection title="Is my data secure?" defaultOpen={false}>
						<p className="text-sm text-neutral-600">
							Absolutely! We take security seriously. Your data is encrypted, we never share your
							information, and we're fully compliant with data protection regulations. See our
							Privacy Policy for details.
						</p>
					</AccordionSection>
				</div>
			</s-section>

			{/* System Information */}
			<s-section heading="System Information">
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
	);
};

export default Page;

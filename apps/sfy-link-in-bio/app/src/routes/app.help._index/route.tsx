import { shortId } from '@blgc/utils';
import { Button } from '@shopify/polaris';
import React from 'react';
import { useSearchParams } from 'react-router';
import { AccordionSection, ApiHealthBadge, PolarisArrowLeftIcon, useCrisp } from '@/components';
import { appConfig } from '@/environment';

const Page: React.FC = () => {
	const [searchParams] = useSearchParams();
	const fromSettings = React.useMemo(() => searchParams.get('from') === 'settings', [searchParams]);
	const crisp = useCrisp();

	const handleStartChat = React.useCallback(() => {
		crisp?.openChat();
		crisp?.startThread(`app-help_${shortId()}`);
	}, [crisp]);

	return (
		<s-page inlineSize="small">
			<ui-title-bar title="Help & Resources"></ui-title-bar>

			<div className="my-4 grid grid-cols-1 gap-4 bg-[var(--p-color-bg)]">
				{/* Back Button */}
				{fromSettings && (
					<div className="flex w-full items-start pl-3">
						<Button url="/app/settings" variant="tertiary" icon={PolarisArrowLeftIcon}>
							Back to Settings
						</Button>
					</div>
				)}

				{/* Get Help */}
				<s-section heading="Get Help">
					<div className="overflow-hidden rounded-lg border border-neutral-200">
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
						<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
							<div>
								<s-heading>Email Support</s-heading>
								<s-paragraph color="subdued">{appConfig.help.email}</s-paragraph>
							</div>
							<s-button variant="secondary" href={`mailto:${appConfig.help.email}`} target="_blank">
								Contact
							</s-button>
						</div>
					</div>
				</s-section>

				{/* Documentation */}
				<s-section heading="Documentation">
					<div className="overflow-hidden rounded-lg border border-neutral-200">
						<s-clickable
							padding="small-100"
							href={appConfig.help.walkthroughVideo}
							target="_blank"
							accessibilityLabel="Watch quick walkthrough video"
						>
							<div className="grid grid-cols-[1fr_auto] items-center gap-4">
								<div>
									<s-heading>Quick Walkthrough</s-heading>
									<s-paragraph color="subdued">
										Watch our 5-minute video guide to get started
									</s-paragraph>
								</div>
								<s-icon type="arrow-up-right"></s-icon>
							</div>
						</s-clickable>
					</div>
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
								You can manage your subscription from the Plans page in Settings. Upgrades take
								effect immediately, while downgrades apply at the next billing cycle. You can cancel
								anytime.
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
					<div className="overflow-hidden rounded-lg border border-neutral-200">
						<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
							<div>
								<s-heading>App Version</s-heading>
								<s-paragraph color="subdued">Current running version</s-paragraph>
							</div>
							<s-badge tone="info">{appConfig.version}</s-badge>
						</div>
						<div className="px-4">
							<s-divider></s-divider>
						</div>
						<div className="group">
							<s-clickable
								padding="small-100"
								href="https://saku.openstatus.dev/"
								target="_blank"
								accessibilityLabel="View system status page in new tab"
							>
								<div className="grid grid-cols-[1fr_auto] items-center gap-4">
									<div>
										<s-heading>System Status</s-heading>
										<s-paragraph color="subdued">Check real-time service status</s-paragraph>
									</div>
									<div className="flex items-center gap-2">
										<ApiHealthBadge />
										<div className="hidden group-hover:block">
											<s-icon type="arrow-up-right"></s-icon>
										</div>
									</div>
								</div>
							</s-clickable>
						</div>
					</div>
				</s-section>

				{/* Legal & Compliance */}
				<s-section heading="Legal & Compliance">
					<div className="overflow-hidden rounded-lg border border-neutral-200">
						<s-clickable
							padding="small-100"
							href={appConfig.help.legal.privacy}
							target="_blank"
							accessibilityLabel="View privacy policy in new tab"
						>
							<div className="grid grid-cols-[1fr_auto] items-center gap-4">
								<div>
									<s-heading>Privacy Policy</s-heading>
									<s-paragraph color="subdued">
										How we collect, use, and protect your data
									</s-paragraph>
								</div>
								<s-icon type="arrow-up-right"></s-icon>
							</div>
						</s-clickable>
						<div className="px-4">
							<s-divider></s-divider>
						</div>
						<s-clickable
							padding="small-100"
							href={appConfig.help.legal.terms}
							target="_blank"
							accessibilityLabel="View terms of service in new tab"
						>
							<div className="grid grid-cols-[1fr_auto] items-center gap-4">
								<div>
									<s-heading>Terms of Service</s-heading>
									<s-paragraph color="subdued">Terms and conditions for using Saku</s-paragraph>
								</div>
								<s-icon type="arrow-up-right"></s-icon>
							</div>
						</s-clickable>
					</div>
				</s-section>
			</div>
		</s-page>
	);
};

export default Page;

import { shortId } from '@blgc/utils';
import { Plan } from '@heymantle/client';
import { useMantle } from '@heymantle/react';
import { Button } from '@shopify/polaris';
import React from 'react';
import { Err, Ok } from 'tuple-result';
import { shopify } from '@/.server/environment';
import { AccordionSection, PolarisArrowLeftIcon, PricingCard, useCrisp } from '@/components';
import { appConfig } from '@/environment';
import { getMantleClient, isMantleError, resultLoader, withResultLoader } from '@/lib';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { plans } = data;
		const { client } = useMantle();
		const crisp = useCrisp();

		const handleSelectPlan = React.useCallback(
			async ({ plan, discount }: TPlanSelection): Promise<void> => {
				const subscription = await client.subscribe({
					planId: plan.id,
					discountId: discount?.id,
					returnUrl: '/app/settings/plans'
				});

				if ('confirmationUrl' in subscription && subscription.confirmationUrl != null) {
					window.open(subscription.confirmationUrl, '_top');
				}
			},
			[client]
		);

		const handleStartChat = React.useCallback(() => {
			crisp?.openChat();
			crisp?.startThread(`app-settings-plans_${shortId()}`);
		}, [crisp]);

		return (
			<s-page inlineSize="small">
				<ui-title-bar title="Select a Plan"></ui-title-bar>

				{/* Back Button */}
				<div className="flex w-full items-start py-4 pl-3">
					<Button url="/app/settings" variant="tertiary" icon={PolarisArrowLeftIcon}>
						Back to Settings
					</Button>
				</div>

				{/* Plans */}
				<div className="mb-4 flex flex-col gap-6 md:flex-row md:justify-center">
					{plans.map((plan) => (
						<PricingCard
							key={plan.id}
							title={plan.name}
							description={plan.description}
							price={plan.price}
							frequency="month"
							features={plan.features}
							featuredText={plan.isRecommended ? 'Recommended' : undefined}
							cta={{
								content: plan.isCurrentPlan
									? 'Current Plan'
									: plan.name.toLowerCase() === 'free'
										? 'Downgrade'
										: 'Upgrade Now',
								variant: plan.isCurrentPlan ? 'secondary' : 'primary',
								disabled: plan.isCurrentPlan,
								onClick: plan.isCurrentPlan
									? undefined
									: () => handleSelectPlan({ plan: { id: plan.id } as TPlan })
							}}
						/>
					))}
				</div>

				{/* FAQ */}
				<s-section heading="Frequently Asked Questions">
					<div className="overflow-hidden rounded-lg border border-neutral-200">
						<AccordionSection title="How does billing work?" defaultOpen={false}>
							<p className="text-sm text-neutral-600">
								All plans are billed monthly. You can cancel or change your plan at any time.
								Upgrades take effect immediately, while downgrades apply at the next billing cycle.
							</p>
						</AccordionSection>
						<AccordionSection title="Can I cancel anytime?" defaultOpen={false}>
							<p className="text-sm text-neutral-600">
								Yes! You can cancel your subscription at any time from your account settings. You'll
								continue to have access until the end of your current billing period.
							</p>
						</AccordionSection>
						<AccordionSection title="What happens when I upgrade?" defaultOpen={false}>
							<p className="text-sm text-neutral-600">
								When you upgrade, you'll get immediate access to all new features. We'll prorate
								your billing so you only pay for the time remaining in your current cycle.
							</p>
						</AccordionSection>
						<AccordionSection title="Is there a free trial?" defaultOpen={false}>
							<p className="text-sm text-neutral-600">
								The Free plan is always available at no cost. For paid plans, we offer a 7-day free
								trial so you can test all features before committing.
							</p>
						</AccordionSection>
					</div>
				</s-section>

				{/* Get Help */}
				<s-section heading="Get Help">
					<div className="overflow-hidden rounded-lg border border-neutral-200">
						<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
							<div>
								<s-heading>Chat with us</s-heading>
								<s-paragraph color="subdued">Get quick help with plans and billing</s-paragraph>
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
							<s-button variant="secondary" href={appConfig.social.discord} target="_blank">
								Join
							</s-button>
						</div>
						<div className="px-4">
							<s-divider></s-divider>
						</div>
						<div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
							<div>
								<s-heading>Email Support</s-heading>
								<s-paragraph color="subdued">{appConfig.support.email}</s-paragraph>
							</div>
							<s-button
								variant="secondary"
								href={`mailto:${appConfig.support.email}`}
								target="_blank"
							>
								Contact
							</s-button>
						</div>
					</div>
				</s-section>
			</s-page>
		);
	},
	Error: ({ error }) => (
		<s-page inlineSize="small">
			<ui-title-bar title="Select a Plan"></ui-title-bar>

			{/* Back Button */}
			<div className="flex w-full items-start py-4 pl-3">
				<Button url="/app/settings" variant="tertiary" icon={PolarisArrowLeftIcon}>
					Back to Settings
				</Button>
			</div>

			{/* Error State */}
			<s-section heading="Unable to Load Plans">
				<div className="p-4">
					<div className="space-y-4">
						<s-paragraph color="subdued">
							We're having trouble loading the available plans. Please try again or contact support
							if the issue persists.
						</s-paragraph>
						<s-button variant="primary" onClick={() => window.location.reload()}>
							Try Again
						</s-button>
					</div>
				</div>
			</s-section>
		</s-page>
	)
});

export default Page;

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);
	const customerApiToken = session.additionalData?.mantleApiToken;
	if (customerApiToken == null) {
		return Err({
			code: '#ERR_NO_MANTLE_TOKEN' as const,
			message: 'No Mantle API token found'
		}).toArray();
	}

	const mantleClient = getMantleClient(customerApiToken);
	const mantleCustomer = await mantleClient.getCustomer();
	if (isMantleError(mantleCustomer)) {
		return Err({
			code: '#ERR_MANTLE_ERROR' as const,
			message: 'Failed to fetch customer data from Mantle'
		}).toArray();
	}

	// Map Mantle plans to our display format
	const plans = mantleCustomer.plans.map((mantlePlan) => {
		const isCurrentPlan = mantleCustomer.subscription?.plan?.id === mantlePlan.id;
		const planName = mantlePlan.name.toLowerCase();

		// Enrich plans with data that can not be stored in Mantle
		let features: TFeature[] = [];
		let description: string = '';
		switch (planName) {
			case 'free':
				description = 'Perfect for getting started';
				features = [
					{ description: 'Link-in-bio on your store domain', included: true },
					{ description: 'Basic customization', included: true },
					{ description: 'Analytics tracking', included: true },
					{ description: 'No watermark', included: false },
					{ description: 'Priority support', included: false },
					{ description: 'Help sustain Saku', included: false }
				];
				break;
			case 'awesome':
				description = 'For growing businesses';
				features = [
					{ description: 'Link-in-bio on your store domain', included: true },
					{ description: 'Advanced customization', included: true },
					{ description: 'Analytics tracking', included: true },
					{ description: 'No watermark', included: true },
					{ description: 'Priority support', included: true },
					{ description: 'Help sustain Saku', included: true }
				];
				break;
			default:
			// do nothing
		}

		return {
			id: mantlePlan.id,
			name: mantlePlan.name,
			description,
			price: new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: (mantlePlan.presentmentCurrencyCode as unknown as string) || 'USD'
			}).format(mantlePlan.presentmentAmount),
			features,
			isRecommended: planName === 'awesome',
			isCurrentPlan,
			mantlePlan
		};
	});

	return Ok({ plans }).toArray();
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	plans: TPlan[];
}

interface TPlan {
	id: string;
	name: string;
	description: string;
	price: string;
	features: TFeature[];
	isRecommended: boolean;
	isCurrentPlan: boolean;
	mantlePlan: Plan;
}

interface TFeature {
	description: string;
	included: boolean;
}

interface TPlanSelection {
	plan: TPlan;
	discount?: TDiscount;
}

interface TDiscount {
	id: string;
	[key: string]: unknown;
}

import { shortId } from '@blgc/utils';
import { Plan } from '@heymantle/client';
import { useMantle } from '@heymantle/react';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { Err, Ok } from 'tuple-result';
import { AppContext } from '@/.server/environment';
import { AccordionSection, PolarisArrowLeftIcon, PricingCard, useCrisp } from '@/components';
import { appConfig } from '@/environment';
import { getMantleClient, isMantleError, resultLoader, withResultLoader } from '@/lib';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { client } = useMantle();
		const crisp = useCrisp();
		const shopifyBridge = useAppBridge();

		const [plans, setPlans] = React.useState(data.plans);
		const [pendingDowngrade, setPendingDowngrade] = React.useState<TPlan | null>(null);
		const [isChangingPlan, setIsChangingPlan] = React.useState(false);

		const currentPlanIndex = React.useMemo(() => {
			return plans.findIndex((p) => p.isCurrentPlan);
		}, [plans]);

		// =========================================================================
		// Events
		// =========================================================================

		const handleConfirmPlanChange = React.useCallback(
			async ({ plan, discount }: TPlanSelection): Promise<void> => {
				setIsChangingPlan(true);

				try {
					const subscription = await client.subscribe({
						planId: plan.id,
						trialDays: plan.trialDays,
						discountId: discount?.id,
						returnUrl: '/app/settings/plans'
					});
					if (isMantleError(subscription)) {
						shopifyBridge.toast.show('Unable to change plan. Please try again.', {
							isError: true,
							duration: 5000
						});
						return;
					}

					// Upgrade - redirect to payment
					if (subscription.confirmationUrl != null) {
						window.open(subscription.confirmationUrl, '_top');
					}
					// Downgrade - update state immediately
					// TODO: Figure out how to implement downgrade at end of billing period
					else {
						setPlans((prevPlans) =>
							prevPlans.map((p) => ({
								...p,
								isCurrentPlan: p.id === plan.id
							}))
						);
					}
				} finally {
					setIsChangingPlan(false);
				}
			},
			[client, shopifyBridge]
		);

		const handleSelectPlan = React.useCallback(
			({ plan, discount }: TPlanSelection): void => {
				const planIndex = plans.findIndex((p) => p.id === plan.id);
				const isDowngrade = currentPlanIndex !== -1 && planIndex < currentPlanIndex;

				// Show confirmation modal for downgrades
				if (isDowngrade) {
					setPendingDowngrade(plan);
					shopifyBridge.modal.show('downgrade-confirmation-modal');
				}
				// Proceed with upgrade immediately
				else {
					handleConfirmPlanChange({ plan, discount });
				}
			},
			[plans, currentPlanIndex, shopifyBridge, handleConfirmPlanChange]
		);

		const handleConfirmDowngrade = React.useCallback(() => {
			if (pendingDowngrade != null) {
				handleConfirmPlanChange({ plan: pendingDowngrade });
				setPendingDowngrade(null);
				shopifyBridge.modal.hide('downgrade-confirmation-modal');
			}
		}, [pendingDowngrade, handleConfirmPlanChange, shopifyBridge]);

		const handleCancelDowngrade = React.useCallback(() => {
			setPendingDowngrade(null);
			shopifyBridge.modal.hide('downgrade-confirmation-modal');
		}, [shopifyBridge]);

		const handleStartChat = React.useCallback(() => {
			crisp?.openChat();
			crisp?.startThread(`app-settings-plans_${shortId()}`);
		}, [crisp]);

		// =========================================================================
		// UI
		// =========================================================================

		return (
			<>
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
						{plans.map((plan, index) => {
							const isDowngrade = currentPlanIndex !== -1 && index < currentPlanIndex;

							return (
								<PricingCard
									key={plan.id}
									title={plan.name}
									description={plan.description}
									price={plan.price}
									frequency="month"
									features={plan.features}
									featuredText={plan.isRecommended ? 'Recommended' : undefined}
									trialDays={plan.trialDays}
									cta={{
										content: plan.isCurrentPlan
											? 'Current Plan'
											: isDowngrade
												? 'Downgrade'
												: 'Upgrade Now',
										variant: plan.isCurrentPlan ? 'secondary' : 'primary',
										disabled: plan.isCurrentPlan || isChangingPlan,
										loading: isChangingPlan,
										onClick: plan.isCurrentPlan ? undefined : () => handleSelectPlan({ plan })
									}}
								/>
							);
						})}
					</div>

					{/* FAQ */}
					<s-section heading="Frequently Asked Questions">
						<div className="overflow-hidden rounded-lg border border-neutral-200">
							<AccordionSection title="How does billing work?" defaultOpen={false}>
								<p className="text-sm text-neutral-600">
									All plans are billed monthly. You can cancel or change your plan at any time. Both
									upgrades and downgrades take effect immediately.
								</p>
							</AccordionSection>
							<AccordionSection title="Can I cancel anytime?" defaultOpen={false}>
								<p className="text-sm text-neutral-600">
									Yes! You can cancel your subscription at any time. Your access will end
									immediately upon cancellation.
								</p>
							</AccordionSection>
							<AccordionSection title="What happens when I upgrade?" defaultOpen={false}>
								<p className="text-sm text-neutral-600">
									When you upgrade, you'll get immediate access to all new features. We'll prorate
									your billing so you only pay for the time remaining in your current cycle.
								</p>
							</AccordionSection>
							<AccordionSection title="What happens when I downgrade?" defaultOpen={false}>
								<p className="text-sm text-neutral-600">
									When you downgrade, the change takes effect immediately. You'll lose access to
									premium features right away and your billing will be adjusted accordingly.
								</p>
							</AccordionSection>
							<AccordionSection title="Is there a free trial?" defaultOpen={false}>
								<p className="text-sm text-neutral-600">
									The Free plan is always available at no cost. For paid plans, we offer a 7-day
									free trial so you can test all features before committing.
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

				{/* Downgrade Confirmation Modal */}
				<Modal id="downgrade-confirmation-modal">
					<div className="p-4">
						<Text variant="bodyMd" as="p">
							You&apos;re about to downgrade to the <strong>{pendingDowngrade?.name}</strong> plan.
							This change will take effect immediately.
						</Text>
						<br />
						<Text variant="bodyMd" as="p">
							You&apos;ll lose access to premium features right away.
						</Text>
					</div>
					<TitleBar title="Confirm Plan Downgrade">
						<button variant="primary" tone="critical" onClick={handleConfirmDowngrade}>
							Downgrade Plan
						</button>
						<button onClick={handleCancelDowngrade}>Cancel</button>
					</TitleBar>
				</Modal>
			</>
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

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ context }) => {
	const {
		shopify: {
			admin: { session }
		}
	} = context.get(AppContext);
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
	const mappedPlans = mantleCustomer.plans.map((mantlePlan) => {
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
			priceAmount: mantlePlan.presentmentAmount,
			trialDays: mantlePlan.trialDays,
			features,
			isRecommended: planName === 'awesome',
			isCurrentPlan,
			mantlePlan
		};
	});

	// Sort plans by price (cheapest to most expensive)
	const plans = mappedPlans.sort((a, b) => a.priceAmount - b.priceAmount);

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
	priceAmount: number;
	trialDays: number;
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

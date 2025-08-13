import { PlanCardStack, PlanCardType } from '@heymantle/polaris';
import { useMantle } from '@heymantle/react';
import { Layout } from '@shopify/polaris';
import React from 'react';

const Page: React.FC = () => {
	const { customer, plans, client } = useMantle();

	const handleSelectPlan = React.useCallback(
		async ({ plan, discount }: TPlanSelection): Promise<void> => {
			const subscription = await client.subscribe({
				planId: plan.id,
				discountId: discount?.id,
				returnUrl: '/app/plans'
			});

			if ('confirmationUrl' in subscription && subscription.confirmationUrl != null) {
				window.open(subscription.confirmationUrl, '_top');
			}
		},
		[client]
	);

	if (customer == null) {
		return null;
	}

	return (
		<s-page>
			<ui-title-bar title="Select a plan" />
			<Layout>
				<Layout.Section>
					<PlanCardStack
						cardType={PlanCardType.Highlighted}
						customer={customer}
						plans={plans}
						onSelectPlan={handleSelectPlan}
					/>
				</Layout.Section>
			</Layout>
		</s-page>
	);
};

export default Page;

interface TPlanSelection {
	plan: TPlan;
	discount?: TDiscount;
}

interface TPlan {
	id: string;
	[key: string]: unknown;
}

interface TDiscount {
	id: string;
	[key: string]: unknown;
}

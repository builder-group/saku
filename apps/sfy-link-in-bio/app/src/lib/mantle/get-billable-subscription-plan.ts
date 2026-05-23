import type { Customer, Plan, Subscription } from '@heymantle/client';

export function getBillableSubscriptionPlan(customer?: Customer | null): Plan | null {
	if (customer == null) {
		return null;
	}

	const subscription = customer.subscription as TMantleSubscription | undefined;
	if (subscription == null) {
		return null;
	}

	if (customer.billingStatus !== 'active' && customer.billingStatus !== 'trialing') {
		return null;
	}

	const isCanceled = subscription.cancelledAt != null || subscription.canceledAt != null;
	// Note: Scheduled cancellation means the old Shopify charge must not block a new approval flow
	const isCancellationScheduled =
		subscription.cancelOn != null || subscription.cancelAtPeriodEnd === true;

	if (
		!subscription.active ||
		isCanceled ||
		isCancellationScheduled ||
		subscription.frozenAt != null
	) {
		return null;
	}

	return subscription.plan;
}

interface TMantleSubscription extends Subscription {
	canceledAt?: string | null;
	cancelAtPeriodEnd?: boolean | null;
}

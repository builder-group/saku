import type { Customer, Plan, Subscription } from '@heymantle/client';
import { describe, expect, it } from 'vitest';
import { getBillableSubscriptionPlan } from './get-billable-subscription-plan';

describe('getBillableSubscriptionPlan function', () => {
	it('should return the subscription plan for active billing', () => {
		const plan = createPlan();
		const customer = createCustomer({
			billingStatus: 'active',
			subscription: createSubscription({ plan })
		});

		expect(getBillableSubscriptionPlan(customer)).toBe(plan);
	});

	it('should return the subscription plan for trialing billing', () => {
		const plan = createPlan();
		const customer = createCustomer({
			billingStatus: 'trialing',
			subscription: createSubscription({ plan })
		});

		expect(getBillableSubscriptionPlan(customer)).toBe(plan);
	});

	it('should return null when billing is not active or trialing', () => {
		const customer = createCustomer({
			billingStatus: 'canceled',
			subscription: createSubscription()
		});

		expect(getBillableSubscriptionPlan(customer)).toBeNull();
	});

	it('should return null when cancellation is scheduled', () => {
		const customer = createCustomer({
			billingStatus: 'trialing',
			subscription: createSubscription({
				cancelOn: '2026-05-30T00:00:00.000Z',
				cancelAtPeriodEnd: true
			})
		});

		expect(getBillableSubscriptionPlan(customer)).toBeNull();
	});

	it('should return null when Mantle returns a US-spelled canceled timestamp', () => {
		const customer = createCustomer({
			billingStatus: 'trialing',
			subscription: createSubscription({
				canceledAt: '2026-05-23T06:19:35.000Z'
			})
		});

		expect(getBillableSubscriptionPlan(customer)).toBeNull();
	});
});

function createCustomer(overrides: Partial<Customer> = {}): Customer {
	return {
		id: 'customer-id',
		test: false,
		plans: [createPlan()],
		features: {},
		usage: {},
		usageCredits: [],
		reviews: [],
		billingStatus: 'none',
		...overrides
	};
}

function createSubscription(overrides: Partial<TMantleSubscription> = {}): TMantleSubscription {
	return {
		id: 'subscription-id',
		plan: createPlan(),
		lineItems: [],
		active: true,
		features: {},
		featuresOrder: [],
		usageCharges: [],
		total: 9,
		subtotal: 9,
		presentmentTotal: 9,
		presentmentSubtotal: 9,
		...overrides
	};
}

function createPlan(overrides: Partial<Plan> = {}): Plan {
	return {
		id: 'awesome-plan-id',
		name: 'Awesome',
		availability: 'public',
		type: 'base',
		currencyCode: 'USD',
		presentmentAmount: 9,
		presentmentCurrencyCode: 'USD',
		total: 9,
		subtotal: 9,
		amount: 9,
		public: true,
		visible: true,
		eligible: true,
		trialDays: 7,
		interval: 'EVERY_30_DAYS',
		features: {},
		featuresOrder: [],
		usageCharges: [],
		discounts: [],
		bundleDiscounts: [],
		...overrides
	};
}

interface TMantleSubscription extends Subscription {
	canceledAt?: string | null;
	cancelAtPeriodEnd?: boolean | null;
}

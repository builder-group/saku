import { mantleClient } from '@/environment';
import { getPlanKey, TPlanKey } from './get-plan-key';
import { isMantleError } from './is-mantle-error';

export async function getCurrentPlan(shopId: string): Promise<TCurrentPlan> {
	const customer = await mantleClient.getCustomer(shopId);
	if (isMantleError(customer)) {
		return {
			id: 'free',
			key: 'free',
			customFields: {}
		};
	}

	const plan = customer.subscription?.plan;
	if (plan == null) {
		return {
			id: 'free',
			key: 'free',
			customFields: {}
		};
	}

	return {
		id: plan.id,
		key: getPlanKey(plan.name),
		customFields: plan.customFields ?? {}
	};
}

interface TCurrentPlan {
	id: string;
	key: TPlanKey;
	customFields: Record<string, unknown>;
}

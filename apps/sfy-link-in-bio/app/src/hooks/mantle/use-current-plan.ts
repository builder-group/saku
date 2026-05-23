import { useMantle } from '@heymantle/react';
import { useMemo } from 'react';
import { logger } from '@/environment';
import { getBillableSubscriptionPlan, getPlanKey, TPlanKey } from '@/lib';

export function useCurrentPlan(): TCurrentPlan {
	const { customer } = useMantle();

	return useMemo(() => {
		const plan = getBillableSubscriptionPlan(customer);

		if (plan == null) {
			logger.warn('🧥 No Mantle plan found, using dummy free plan');
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
	}, [customer]);
}

export interface TCurrentPlan {
	id: string;
	key: TPlanKey;
	customFields: Record<string, unknown>;
}

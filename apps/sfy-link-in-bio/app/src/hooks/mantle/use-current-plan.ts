import { useMantle } from '@heymantle/react';
import { useMemo } from 'react';
import { logger } from '@/environment';
import { getPlanKey, TPlanKey } from '@/lib';

export function useCurrentPlan(): TCurrentPlan {
	const { subscription } = useMantle();

	return useMemo(() => {
		const plan = subscription?.plan;

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
	}, [subscription?.plan]);
}

export interface TCurrentPlan {
	id: string;
	key: TPlanKey;
	customFields: Record<string, unknown>;
}

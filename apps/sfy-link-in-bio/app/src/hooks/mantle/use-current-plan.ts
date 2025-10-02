import { useMantle } from '@heymantle/react';
import { useMemo } from 'react';
import { logger } from '@/environment';

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
			key: plan.name.toLowerCase() as 'free' | 'awesome',
			customFields: plan.customFields ?? {}
		};
	}, [subscription?.plan]);
}

export interface TCurrentPlan {
	id: string;
	key: 'free' | 'awesome';
	customFields: Record<string, unknown>;
}

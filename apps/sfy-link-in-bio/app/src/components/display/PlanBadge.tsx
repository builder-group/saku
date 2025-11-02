import React from 'react';
import { cn, TPlanKey } from '@/lib';
import { Badge, type TBadgeProps } from './Badge';
import { CrownIcon } from './icons';

export const PlanBadge: React.FC<TPlanBadgeProps> = (props) => {
	const { plan = 'awesome', showPlanName = true, className, ...badgeProps } = props;
	const planDisplayName = React.useMemo(() => {
		switch (plan) {
			case 'awesome':
				return 'Awesome';
			default:
				return 'Free';
		}
	}, [plan]);

	return (
		<Badge
			tone="default"
			className={cn(
				'bg-linear-to-r from-[#E6F7FF] via-[#F2E6FF] to-[#FFE6F0]',
				!showPlanName && 'px-0.5 py-0.5',
				className
			)}
			{...badgeProps}
		>
			<CrownIcon
				className={cn(
					'h-4 w-4',
					// Override Polaris Tabs disabled state that sets path fill to disabled color
					'[&_path]:fill-current!'
				)}
			/>
			{showPlanName && <span>{planDisplayName}</span>}
		</Badge>
	);
};

export interface TPlanBadgeProps extends Omit<TBadgeProps, 'variant' | 'children'> {
	plan?: TPlanKey;
	showPlanName?: boolean;
}

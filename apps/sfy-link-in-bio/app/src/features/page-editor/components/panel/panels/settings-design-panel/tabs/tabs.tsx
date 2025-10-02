import { TabProps, Tooltip } from '@shopify/polaris';
import { PlanBadge } from '@/components';
import { TCurrentPlan } from '@/hooks';

export function getTabs(plan: TCurrentPlan): TabProps[] {
	return [
		{
			id: 'theme',
			content: 'Theme',
			panelID: 'theme'
		},
		{
			id: 'customize',
			content: 'Customize',
			panelID: 'customize'
		},
		{
			id: 'advanced',
			content:
				plan.key === 'free'
					? ((
							<Tooltip
								content="Advanced design options are only available on Awesome plan and above"
								width="wide"
								preferredPosition="below"
							>
								<div className="flex items-center gap-2">
									<span>Advanced</span>
									<PlanBadge plan="awesome" showPlanName={false} />
								</div>
							</Tooltip>
						) as unknown as string)
					: 'Advanced',
			panelID: 'advanced'
		}
	];
}

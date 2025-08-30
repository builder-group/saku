import { TabProps } from '@shopify/polaris';

export const tabs = [
	{
		id: 'default',
		content: 'Default',
		panelID: 'default'
	},
	{
		id: 'facebook',
		content: 'Facebook',
		panelID: 'facebook'
	},
	{
		id: 'linkedin',
		content: 'LinkedIn',
		panelID: 'linkedin'
	},
	{
		id: 'x',
		content: 'X/Twitter',
		panelID: 'x'
	}
] satisfies TabProps[];

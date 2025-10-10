import { TabProps } from '@shopify/polaris';

export const tabs = [
	{
		id: 'content',
		content: 'Content',
		panelID: 'content'
	},
	{
		id: 'style',
		content: 'Style',
		panelID: 'style'
	},
	{
		id: 'analytics',
		content: 'Analytics',
		panelID: 'analytics'
	}
] satisfies TabProps[];

import { inherit } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	icon: LayoutSectionIcon,
	label: 'Link',
	internal: false,
	defaultData: {
		content: {
			url: 'https://www.shopify.com/',
			variant: {
				type: 'default',
				userTitle: 'Add your title here'
			}
		},
		layout: {
			padding: inherit()
		},
		appearance: {
			borderRadius: inherit(),
			opacity: inherit(),
			visible: true
		},
		typography: {
			font: inherit(),
			fontSize: inherit(),
			textColor: inherit(),
			textAlign: inherit(),
			lineHeight: inherit(),
			letterSpacing: inherit()
		},
		fill: inherit(),
		stroke: inherit(),
		shadow: inherit()
	}
};

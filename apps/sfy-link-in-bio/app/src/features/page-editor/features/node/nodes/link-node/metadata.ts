import { inheritStyle } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../types';

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
		style: {
			padding: inheritStyle(),
			backgroundColor: inheritStyle(),
			font: inheritStyle(),
			fontSize: inheritStyle(),
			textColor: inheritStyle(),
			textAlign: inheritStyle(),
			borderRadius: inheritStyle(),
			shadow: inheritStyle()
		}
	}
};

import { tokenRef } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	icon: LayoutSectionIcon,
	label: 'Link',
	internal: false,
	defaultData: {
		content: {
			type: 'single',
			url: 'https://www.shopify.com/',
			title: 'Add your title here'
		},
		autoLayout: {
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef()
		},
		appearance: {
			visible: true,
			opacity: tokenRef(),
			borderRadius: tokenRef()
		},
		fill: tokenRef(),
		stroke: tokenRef(),
		shadow: tokenRef(),
		text: {
			appearance: {
				visible: true,
				opacity: tokenRef()
			},
			typography: {
				font: tokenRef(),
				fontSize: tokenRef(),
				textAlignHorizontal: tokenRef(),
				textAlignVertical: tokenRef(),
				lineHeight: tokenRef(),
				letterSpacing: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef()
		},
		smText: {
			appearance: {
				visible: true,
				opacity: tokenRef('sm')
			},
			typography: {
				font: tokenRef('sm'),
				fontSize: tokenRef('sm'),
				textAlignHorizontal: tokenRef('sm'),
				textAlignVertical: tokenRef('sm'),
				lineHeight: tokenRef('sm'),
				letterSpacing: tokenRef('sm')
			},
			fill: tokenRef('sm'),
			stroke: tokenRef('sm'),
			shadow: tokenRef('sm')
		},
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef()
			},
			stroke: tokenRef(),
			shadow: tokenRef()
		}
	}
};

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
		headingText: {
			appearance: {
				visible: true,
				opacity: tokenRef('heading')
			},
			typography: {
				font: tokenRef('heading'),
				fontSize: tokenRef('heading'),
				textAlignHorizontal: tokenRef('heading'),
				textAlignVertical: tokenRef('heading'),
				lineHeight: tokenRef('heading'),
				letterSpacing: tokenRef('heading')
			},
			fill: tokenRef('heading'),
			stroke: tokenRef('heading'),
			shadow: tokenRef('heading')
		},
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

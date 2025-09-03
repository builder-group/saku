import { tokenRef } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const aboutNodeMetadata: TNodeMetadata<'about'> = {
	type: 'about',
	icon: LayoutSectionIcon,
	label: 'About',
	internal: false,
	defaultData: {
		content: {
			type: 'default',
			name: 'Your Name',
			bio: 'Tell us about yourself',
			socialLinks: []
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
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
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
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
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

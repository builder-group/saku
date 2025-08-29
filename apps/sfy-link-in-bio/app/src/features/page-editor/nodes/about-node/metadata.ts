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
			name: 'Your Name',
			bio: 'Tell us about yourself',
			socialLinks: []
		},
		autoLayout: {
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef(),
			verticalGap: tokenRef()
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
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef(),
				letterSpacing: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef()
		}
	}
};

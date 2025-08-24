import { inherit } from '@repo/editor';
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
			horizontalPadding: inherit(),
			verticalPadding: inherit(),
			verticalGap: inherit()
		},
		appearance: {
			visible: true,
			opacity: inherit(),
			borderRadius: inherit()
		},
		fill: inherit(),
		stroke: inherit(),
		shadow: inherit(),
		text: {
			appearance: {
				visible: true,
				opacity: inherit()
			},
			typography: {
				font: inherit(),
				fontSize: inherit(),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: inherit(),
				letterSpacing: inherit()
			},
			fill: inherit(),
			stroke: inherit(),
			shadow: inherit()
		}
	}
};

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
		layout: {
			padding: inherit()
		},
		appearance: {
			borderRadius: inherit(),
			opacity: inherit(),
			visible: inherit()
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

import { inheritStyle } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../types';

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

import { inheritStyle } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../types';

export const mediaNodeMetadata: TNodeMetadata<'media'> = {
	type: 'media',
	icon: LayoutSectionIcon,
	label: 'Media',
	internal: false,
	defaultData: {
		content: {},
		style: {
			padding: inheritStyle(),
			backgroundColor: inheritStyle(),
			borderRadius: inheritStyle(),
			shadow: inheritStyle()
		}
	}
};

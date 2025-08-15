import { inherit } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const mediaNodeMetadata: TNodeMetadata<'media'> = {
	type: 'media',
	icon: LayoutSectionIcon,
	label: 'Media',
	internal: false,
	defaultData: {
		content: {},
		layout: {
			padding: inherit()
		},
		appearance: {
			borderRadius: inherit(),
			opacity: inherit(),
			visible: inherit()
		},
		fill: inherit(),
		stroke: inherit(),
		shadow: inherit()
	}
};

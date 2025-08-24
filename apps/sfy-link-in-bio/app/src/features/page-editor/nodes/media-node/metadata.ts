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
		shadow: inherit()
	}
};

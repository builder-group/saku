import { inherit } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib/node/types';

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	icon: LayoutSectionIcon,
	label: 'Text',
	internal: false,
	defaultData: {
		content: {
			text: 'Add your text here'
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
				textAlignHorizontal: inherit(),
				textAlignVertical: inherit(),
				lineHeight: inherit(),
				letterSpacing: inherit()
			},
			fill: inherit(),
			stroke: inherit(),
			shadow: inherit()
		}
	}
};

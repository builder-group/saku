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
		layout: {
			padding: inherit()
		},
		appearance: {
			borderRadius: inherit(),
			opacity: inherit(),
			visible: true
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

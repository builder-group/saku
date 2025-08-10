import { inheritStyle } from '@repo/editor';
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

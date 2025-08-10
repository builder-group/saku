import { inheritStyle } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	icon: LayoutSectionIcon,
	label: 'Product',
	internal: false,
	defaultData: {
		content: {},
		style: {
			padding: inheritStyle(),
			backgroundColor: inheritStyle(),
			font: inheritStyle(),
			fontSize: inheritStyle(),
			textColor: inheritStyle(),
			borderRadius: inheritStyle(),
			shadow: inheritStyle()
		}
	}
};

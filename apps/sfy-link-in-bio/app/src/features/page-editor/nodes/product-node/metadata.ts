import { inherit } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	icon: LayoutSectionIcon,
	label: 'Product',
	internal: false,
	defaultData: {
		content: {},
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

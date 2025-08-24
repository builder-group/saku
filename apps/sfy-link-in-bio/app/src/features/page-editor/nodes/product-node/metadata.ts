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
				textAlignHorizontal: 'start',
				textAlignVertical: inherit(),
				lineHeight: inherit(),
				letterSpacing: inherit()
			},
			fill: inherit(),
			stroke: inherit(),
			shadow: inherit()
		},
		cta: {
			appearance: {
				visible: true,
				opacity: inherit()
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
	}
};

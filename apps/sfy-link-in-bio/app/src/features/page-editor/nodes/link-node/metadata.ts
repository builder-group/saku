import { inherit } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	icon: LayoutSectionIcon,
	label: 'Link',
	internal: false,
	defaultData: {
		content: {
			url: 'https://www.shopify.com/',
			variant: {
				type: 'default',
				title: 'Add your title here'
			}
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

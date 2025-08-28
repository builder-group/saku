import { tokenRef } from '@repo/editor';
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
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef(),
			verticalGap: tokenRef()
		},
		appearance: {
			visible: true,
			opacity: tokenRef(),
			borderRadius: tokenRef()
		},
		fill: tokenRef(),
		stroke: tokenRef(),
		shadow: tokenRef(),
		text: {
			appearance: {
				visible: true,
				opacity: tokenRef()
			},
			typography: {
				font: tokenRef(),
				fontSize: tokenRef(),
				textAlignHorizontal: 'start',
				textAlignVertical: tokenRef(),
				lineHeight: tokenRef(),
				letterSpacing: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef()
		},
		button: {
			appearance: {
				visible: true,
				opacity: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef(),
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef()
				},
				typography: {
					font: tokenRef(),
					fontSize: tokenRef(),
					textAlignHorizontal: tokenRef(),
					textAlignVertical: tokenRef(),
					lineHeight: tokenRef(),
					letterSpacing: tokenRef()
				},
				fill: tokenRef(),
				stroke: tokenRef(),
				shadow: tokenRef()
			}
		}
	}
};

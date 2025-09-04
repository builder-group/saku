import { tokenRef } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	icon: LayoutSectionIcon,
	label: 'Product',
	internal: false,
	defaultData: {
		content: {
			type: 'single'
		},
		autoLayout: {
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef()
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
		primaryButton: {
			appearance: {
				visible: true,
				opacity: tokenRef('primary'),
				borderRadius: tokenRef('primary')
			},
			fill: tokenRef('primary'),
			stroke: tokenRef('primary'),
			shadow: tokenRef('primary'),
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef('primary')
				},
				typography: {
					font: tokenRef('primary'),
					fontSize: tokenRef('primary'),
					textAlignHorizontal: tokenRef('primary'),
					textAlignVertical: tokenRef('primary'),
					lineHeight: tokenRef('primary'),
					letterSpacing: tokenRef('primary')
				},
				fill: tokenRef('primary'),
				stroke: tokenRef('primary'),
				shadow: tokenRef('primary')
			}
		},
		badge: {
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
					textAlignHorizontal: tokenRef(),
					textAlignVertical: tokenRef(),
					lineHeight: tokenRef(),
					letterSpacing: tokenRef()
				},
				fill: tokenRef(),
				stroke: tokenRef(),
				shadow: tokenRef()
			}
		},
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef(),
				borderRadius: tokenRef()
			},
			stroke: tokenRef(),
			shadow: tokenRef()
		},
		productDetails: {
			appearance: {
				visible: true,
				opacity: tokenRef(),
				borderRadius: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef(),
			xlText: {
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
			},
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
			},
			primaryButton: {
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
						textAlignHorizontal: tokenRef(),
						textAlignVertical: tokenRef(),
						lineHeight: tokenRef(),
						letterSpacing: tokenRef()
					},
					fill: tokenRef(),
					stroke: tokenRef(),
					shadow: tokenRef()
				}
			},
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef(),
					borderRadius: tokenRef()
				},
				stroke: tokenRef(),
				shadow: tokenRef()
			}
		}
	}
};

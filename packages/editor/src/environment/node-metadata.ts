import { tokenRef } from '../lib';
import { TFlatNode } from '../types';

export const aboutNodeMetadata: TNodeMetadata<'about'> = {
	type: 'about',
	label: 'About',
	default: {
		content: {
			type: 'default',
			name: 'Your Name',
			bio: 'Tell us about yourself',
			contactIcons: []
		},
		autoLayout: {
			horizontalPadding: tokenRef('auto-layout', 'default', true),
			verticalPadding: tokenRef('auto-layout', 'default', true),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance', 'default'),
		fill: null,
		stroke: null,
		shadow: null,
		textXl: {
			appearance: tokenRef('text', 'xl', true),
			typography: {
				font: tokenRef('text', 'xl', true),
				fontSize: tokenRef('text', 'xl', true),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('text', 'xl', true),
				letterSpacing: tokenRef('text', 'xl', true)
			},
			fill: tokenRef('text', 'xl', true),
			stroke: tokenRef('text', 'xl', true),
			shadow: tokenRef('text', 'xl', true)
		},
		text: {
			appearance: tokenRef('text', 'default', true),
			typography: {
				font: tokenRef('text', 'default', true),
				fontSize: tokenRef('text', 'default', true),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('text', 'default', true),
				letterSpacing: tokenRef('text', 'default', true)
			},
			fill: tokenRef('text', 'default', true),
			stroke: tokenRef('text', 'default', true),
			shadow: tokenRef('text', 'default', true)
		},
		image: tokenRef('image', 'default')
	}
};

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	label: 'Link',
	default: {
		content: {
			type: 'single',
			url: 'https://www.shopify.com/',
			title: 'Add your title here'
		},
		autoLayout: {
			horizontalPadding: tokenRef('auto-layout', 'default', true),
			verticalPadding: tokenRef('auto-layout', 'default', true),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance', 'default'),
		fill: tokenRef('fill', 'default'),
		stroke: tokenRef('stroke', 'default'),
		shadow: tokenRef('shadow', 'default'),
		text: tokenRef('text', 'default'),
		textSm: tokenRef('text', 'sm'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('image', 'default', true),
				borderRadius: null
			},
			stroke: tokenRef('image', 'default', true),
			shadow: tokenRef('image', 'default', true)
		}
	}
};

export const mediaNodeMetadata: TNodeMetadata<'media'> = {
	type: 'media',
	label: 'Media',
	default: {
		content: {
			type: 'image'
		},
		autoLayout: {
			horizontalPadding: 0,
			verticalPadding: 0,
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance', 'default'),
		fill: tokenRef('fill', 'default'),
		stroke: tokenRef('stroke', 'default'),
		shadow: tokenRef('shadow', 'default'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('image', 'default', true),
				borderRadius: null
			},
			stroke: tokenRef('image', 'default', true),
			shadow: tokenRef('image', 'default', true)
		}
	}
};

export const pageNodeMetadata: TNodeMetadata<'page'> = {
	type: 'page',
	label: 'Page',
	default: {
		autoLayout: {
			horizontalPadding: 24,
			verticalPadding: 48,
			verticalGap: 24,
			horizontalGap: null
		},
		appearance: {
			visible: true,
			opacity: 1,
			borderRadius: null
		},
		fill: tokenRef('fill', 'default'),
		children: [],
		content: {
			type: 'default',
			hasWatermark: true
		},
		metadata: {}
	}
};

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	label: 'Product',
	default: {
		content: {
			type: 'single'
		},
		autoLayout: {
			horizontalPadding: tokenRef('auto-layout', 'default', true),
			verticalPadding: tokenRef('auto-layout', 'default', true),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance', 'default'),
		fill: tokenRef('fill', 'default'),
		stroke: tokenRef('stroke', 'default'),
		shadow: tokenRef('shadow', 'default'),
		text: {
			appearance: tokenRef('text', 'default', true),
			typography: {
				font: tokenRef('text', 'default', true),
				fontSize: tokenRef('text', 'default', true),
				textAlignHorizontal: 'start',
				textAlignVertical: tokenRef('text', 'default', true),
				lineHeight: tokenRef('text', 'default', true),
				letterSpacing: tokenRef('text', 'default', true)
			},
			fill: tokenRef('text', 'default', true),
			stroke: tokenRef('text', 'default', true),
			shadow: tokenRef('text', 'default', true)
		},
		buttonPrimary: tokenRef('button', 'primary'),
		badgePrimary: tokenRef('badge', 'primary'),
		badgeNeutral: tokenRef('badge', 'neutral'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('image', 'default', true),
				borderRadius: null
			},
			stroke: tokenRef('image', 'default', true),
			shadow: tokenRef('image', 'default', true)
		},
		productDetails: tokenRef('product-details', 'default')
	}
};

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	label: 'Text',
	default: {
		content: {
			type: 'default',
			text: { type: 'markdown', value: 'Add your text here' }
		},
		autoLayout: {
			horizontalPadding: tokenRef('auto-layout', 'default', true),
			verticalPadding: tokenRef('auto-layout', 'default', true),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance', 'default'),
		fill: tokenRef('fill', 'default'),
		stroke: tokenRef('stroke', 'default'),
		shadow: tokenRef('shadow', 'default'),
		text: tokenRef('text', 'default')
	}
};

export const nodeMetadataMap = {
	page: pageNodeMetadata,
	about: aboutNodeMetadata,
	link: linkNodeMetadata,
	media: mediaNodeMetadata,
	text: textNodeMetadata,
	product: productNodeMetadata
} as const;

export type TNodeMetadata<GType extends TFlatNode['type']> = {
	type: GType;
	label: string;
	default: Omit<Extract<TFlatNode, { type: GType }>, 'id' | 'type'>;
};

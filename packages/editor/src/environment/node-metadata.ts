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
			horizontalPadding: tokenRef('mixin', 'default'),
			verticalPadding: tokenRef('mixin', 'default'),
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: tokenRef('mixin', 'default'),
		fill: null,
		stroke: null,
		shadow: null,
		textXl: tokenRef('mixin', 'xl'),
		text: tokenRef('mixin', 'default'),
		image: {
			appearance: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		}
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
			horizontalPadding: tokenRef('mixin', 'default'),
			verticalPadding: tokenRef('mixin', 'default'),
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: tokenRef('mixin', 'default'),
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: tokenRef('mixin', 'default'),
		textSm: tokenRef('mixin', 'sm'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: null
			},
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
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
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: tokenRef('mixin', 'default'),
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: null
			},
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
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
			horizontalGap: undefined
		},
		appearance: {
			visible: true,
			opacity: 1,
			borderRadius: null
		},
		fill: tokenRef('mixin', 'default'),
		children: [],
		content: {
			type: 'default'
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
			horizontalPadding: tokenRef('mixin', 'default'),
			verticalPadding: tokenRef('mixin', 'default'),
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: tokenRef('mixin', 'default'),
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: tokenRef('mixin', 'default'),
		buttonPrimary: {
			appearance: tokenRef('mixin', 'primary'),
			fill: tokenRef('mixin', 'primary'),
			stroke: tokenRef('mixin', 'primary'),
			shadow: tokenRef('mixin', 'primary'),
			text: tokenRef('mixin', 'primary')
		},
		badgePrimary: {
			appearance: tokenRef('mixin', 'primary'),
			fill: tokenRef('mixin', 'primary'),
			stroke: tokenRef('mixin', 'primary'),
			shadow: tokenRef('mixin', 'primary'),
			text: tokenRef('mixin', 'primary')
		},
		badgeNeutral: {
			appearance: tokenRef('mixin', 'neutral'),
			fill: tokenRef('mixin', 'neutral'),
			stroke: tokenRef('mixin', 'neutral'),
			shadow: tokenRef('mixin', 'neutral'),
			text: tokenRef('mixin', 'neutral')
		},
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: null
			},
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		},
		productDetails: {
			appearance: tokenRef('mixin', 'default'),
			fill: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default'),
			textXl: tokenRef('mixin', 'default'),
			text: tokenRef('mixin', 'default'),
			buttonPrimary: {
				appearance: tokenRef('mixin', 'default'),
				fill: tokenRef('mixin', 'default'),
				stroke: tokenRef('mixin', 'default'),
				shadow: tokenRef('mixin', 'default'),
				text: tokenRef('mixin', 'default')
			},
			image: {
				appearance: tokenRef('mixin', 'default'),
				stroke: tokenRef('mixin', 'default'),
				shadow: tokenRef('mixin', 'default')
			}
		}
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
			horizontalPadding: tokenRef('mixin', 'default'),
			verticalPadding: tokenRef('mixin', 'default'),
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: tokenRef('mixin', 'default'),
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: tokenRef('mixin', 'default')
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

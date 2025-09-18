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
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('mixin', 'default'),
		fill: null,
		stroke: null,
		shadow: null,
		textXl: {
			appearance: tokenRef('mixin', 'xl'),
			typography: {
				font: tokenRef('mixin', 'xl'),
				fontSize: tokenRef('mixin', 'xl'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('mixin', 'xl'),
				letterSpacing: tokenRef('mixin', 'xl')
			},
			fill: tokenRef('mixin', 'xl'),
			stroke: tokenRef('mixin', 'xl'),
			shadow: tokenRef('mixin', 'xl')
		},
		text: {
			appearance: tokenRef('mixin', 'default'),
			typography: {
				font: tokenRef('mixin', 'default'),
				fontSize: tokenRef('mixin', 'default'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('mixin', 'default'),
				letterSpacing: tokenRef('mixin', 'default')
			},
			fill: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		},
		image: tokenRef('mixin', 'default')
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
			horizontalGap: null,
			verticalGap: null
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
			horizontalGap: null,
			verticalGap: null
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
			horizontalGap: null
		},
		appearance: {
			visible: true,
			opacity: 1,
			borderRadius: null
		},
		fill: tokenRef('mixin', 'default'),
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
			horizontalPadding: tokenRef('mixin', 'default'),
			verticalPadding: tokenRef('mixin', 'default'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('mixin', 'default'),
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: {
			appearance: tokenRef('mixin', 'default'),
			typography: {
				font: tokenRef('mixin', 'default'),
				fontSize: tokenRef('mixin', 'default'),
				textAlignHorizontal: 'start',
				textAlignVertical: tokenRef('mixin', 'default'),
				lineHeight: tokenRef('mixin', 'default'),
				letterSpacing: tokenRef('mixin', 'default')
			},
			fill: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		},
		buttonPrimary: tokenRef('mixin', 'primary'),
		badgePrimary: tokenRef('mixin', 'primary'),
		badgeNeutral: tokenRef('mixin', 'neutral'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: null
			},
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		},
		productDetails: tokenRef('mixin', 'default')
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
			horizontalGap: null,
			verticalGap: null
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

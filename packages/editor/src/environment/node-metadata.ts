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
			horizontalPadding: tokenRef('default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('default', 'appearance'),
		fill: null,
		stroke: null,
		shadow: null,
		textXl: {
			appearance: tokenRef('xl', 'text', 'appearance'),
			typography: {
				font: tokenRef('xl', 'text', 'typography.font'),
				fontSize: tokenRef('xl', 'text', 'typography.fontSize'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('xl', 'text', 'typography.lineHeight'),
				letterSpacing: tokenRef('xl', 'text', 'typography.letterSpacing')
			},
			fill: tokenRef('xl', 'text', 'fill'),
			stroke: tokenRef('xl', 'text', 'stroke'),
			shadow: tokenRef('xl', 'text', 'shadow')
		},
		text: {
			appearance: tokenRef('default', 'text', 'appearance'),
			typography: {
				font: tokenRef('default', 'text', 'typography.font'),
				fontSize: tokenRef('default', 'text', 'typography.fontSize'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('default', 'text', 'typography.lineHeight'),
				letterSpacing: tokenRef('default', 'text', 'typography.letterSpacing')
			},
			fill: tokenRef('default', 'text', 'fill'),
			stroke: tokenRef('default', 'text', 'stroke'),
			shadow: tokenRef('default', 'text', 'shadow')
		},
		image: tokenRef('default', 'image')
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
			horizontalPadding: tokenRef('default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('default', 'appearance'),
		fill: tokenRef('default', 'fill'),
		stroke: tokenRef('default', 'stroke'),
		shadow: tokenRef('default', 'shadow'),
		text: tokenRef('default', 'text'),
		textSm: tokenRef('sm', 'text'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('default', 'image', 'appearance.opacity'),
				borderRadius: null
			},
			stroke: tokenRef('default', 'image', 'stroke'),
			shadow: tokenRef('default', 'image', 'shadow')
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
		appearance: tokenRef('default', 'appearance'),
		fill: tokenRef('default', 'fill'),
		stroke: tokenRef('default', 'stroke'),
		shadow: tokenRef('default', 'shadow'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('default', 'image', 'appearance.opacity'),
				borderRadius: null
			},
			stroke: tokenRef('default', 'image', 'stroke'),
			shadow: tokenRef('default', 'image', 'shadow')
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
		fill: tokenRef('default', 'fill'),
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
			horizontalPadding: tokenRef('default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('default', 'appearance'),
		fill: tokenRef('default', 'fill'),
		stroke: tokenRef('default', 'stroke'),
		shadow: tokenRef('default', 'shadow'),
		text: {
			appearance: tokenRef('default', 'text', 'appearance'),
			typography: {
				font: tokenRef('default', 'text', 'typography.font'),
				fontSize: tokenRef('default', 'text', 'typography.fontSize'),
				textAlignHorizontal: 'start',
				textAlignVertical: tokenRef('default', 'text', 'typography.textAlignVertical'),
				lineHeight: tokenRef('default', 'text', 'typography.lineHeight'),
				letterSpacing: tokenRef('default', 'text', 'typography.letterSpacing')
			},
			fill: tokenRef('default', 'text', 'fill'),
			stroke: tokenRef('default', 'text', 'stroke'),
			shadow: tokenRef('default', 'text', 'shadow')
		},
		buttonPrimary: tokenRef('primary', 'button'),
		badgeSecondary: tokenRef('secondary', 'badge'),
		badgeNeutral: tokenRef('neutral', 'badge'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('default', 'image', 'appearance.opacity'),
				borderRadius: null
			},
			stroke: tokenRef('default', 'image', 'stroke'),
			shadow: tokenRef('default', 'image', 'shadow')
		},
		productDetails: tokenRef('default', 'product-details')
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
			horizontalPadding: tokenRef('default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('default', 'appearance'),
		fill: tokenRef('default', 'fill'),
		stroke: tokenRef('default', 'stroke'),
		shadow: tokenRef('default', 'shadow'),
		text: tokenRef('default', 'text')
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

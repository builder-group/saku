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
			horizontalPadding: tokenRef('auto-layout.default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('auto-layout.default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance.default', 'appearance'),
		fill: null,
		stroke: null,
		shadow: null,
		textXl: {
			appearance: tokenRef('text.xl', 'text', 'appearance'),
			typography: {
				font: tokenRef('text.xl', 'text', 'typography.font'),
				fontSize: tokenRef('text.xl', 'text', 'typography.fontSize'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('text.xl', 'text', 'typography.lineHeight'),
				letterSpacing: tokenRef('text.xl', 'text', 'typography.letterSpacing')
			},
			fill: {
				paint: tokenRef('paint.base200.content', 'paint.solid'),
				opacity: tokenRef('text.xl', 'text', 'fill.opacity')
			},
			stroke: tokenRef('text.xl', 'text', 'stroke'),
			shadow: tokenRef('text.xl', 'text', 'shadow')
		},
		text: {
			appearance: tokenRef('text.default', 'text', 'appearance'),
			typography: {
				font: tokenRef('text.default', 'text', 'typography.font'),
				fontSize: tokenRef('text.default', 'text', 'typography.fontSize'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('text.default', 'text', 'typography.lineHeight'),
				letterSpacing: tokenRef('text.default', 'text', 'typography.letterSpacing')
			},
			fill: {
				paint: tokenRef('paint.base200.content', 'paint.solid'),
				opacity: tokenRef('text.default', 'text', 'fill.opacity')
			},
			stroke: tokenRef('text.default', 'text', 'stroke'),
			shadow: tokenRef('text.default', 'text', 'shadow')
		},
		image: tokenRef('image.default', 'image')
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
			horizontalPadding: tokenRef('auto-layout.default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('auto-layout.default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance.default', 'appearance'),
		fill: tokenRef('fill.default', 'fill'),
		stroke: tokenRef('stroke.default', 'stroke'),
		shadow: tokenRef('shadow.default', 'shadow'),
		text: tokenRef('text.default', 'text'),
		textSm: tokenRef('text.sm', 'text'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('image.default', 'image', 'appearance.opacity'),
				borderRadius: null
			},
			stroke: tokenRef('image.default', 'image', 'stroke'),
			shadow: tokenRef('image.default', 'image', 'shadow')
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
		appearance: tokenRef('appearance.default', 'appearance'),
		fill: tokenRef('fill.default', 'fill'),
		stroke: tokenRef('stroke.default', 'stroke'),
		shadow: tokenRef('shadow.default', 'shadow'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('image.default', 'image', 'appearance.opacity'),
				borderRadius: null
			},
			stroke: tokenRef('image.default', 'image', 'stroke'),
			shadow: tokenRef('image.default', 'image', 'shadow')
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
		fill: tokenRef('fill.default', 'fill'),
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
			horizontalPadding: tokenRef('auto-layout.default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('auto-layout.default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance.default', 'appearance'),
		fill: tokenRef('fill.default', 'fill'),
		stroke: tokenRef('stroke.default', 'stroke'),
		shadow: tokenRef('shadow.default', 'shadow'),
		text: {
			appearance: tokenRef('text.default', 'text', 'appearance'),
			typography: {
				font: tokenRef('text.default', 'text', 'typography.font'),
				fontSize: tokenRef('text.default', 'text', 'typography.fontSize'),
				textAlignHorizontal: 'start',
				textAlignVertical: tokenRef('text.default', 'text', 'typography.textAlignVertical'),
				lineHeight: tokenRef('text.default', 'text', 'typography.lineHeight'),
				letterSpacing: tokenRef('text.default', 'text', 'typography.letterSpacing')
			},
			fill: tokenRef('text.default', 'text', 'fill'),
			stroke: tokenRef('text.default', 'text', 'stroke'),
			shadow: tokenRef('text.default', 'text', 'shadow')
		},
		buttonPrimary: tokenRef('button.primary', 'button'),
		badgeSecondary: tokenRef('badge.secondary', 'badge'),
		badgeNeutral: tokenRef('badge.neutral', 'badge'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('image.default', 'image', 'appearance.opacity'),
				borderRadius: null
			},
			stroke: tokenRef('image.default', 'image', 'stroke'),
			shadow: tokenRef('image.default', 'image', 'shadow')
		},
		productDetails: tokenRef('product-details.default', 'product-details')
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
			horizontalPadding: tokenRef('auto-layout.default', 'auto-layout', 'horizontalPadding'),
			verticalPadding: tokenRef('auto-layout.default', 'auto-layout', 'verticalPadding'),
			horizontalGap: null,
			verticalGap: null
		},
		appearance: tokenRef('appearance.default', 'appearance'),
		fill: tokenRef('fill.default', 'fill'),
		stroke: tokenRef('stroke.default', 'stroke'),
		shadow: tokenRef('shadow.default', 'shadow'),
		text: tokenRef('text.default', 'text')
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

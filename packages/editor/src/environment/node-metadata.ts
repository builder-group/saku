import { tokenRef } from '../lib';
import { TFlatNode } from '../types';

export const aboutNodeMetadata: TNodeMetadata<'about'> = {
	type: 'about',
	label: 'About',
	bundleMap: {
		default: {
			type: 'about',
			bundle: 'default',
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
	}
};

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	label: 'Link',
	bundleMap: {
		'single': {
			type: 'link',
			bundle: 'single',
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
		},
		'youtube-embed': {
			type: 'link',
			bundle: 'youtube-embed',
			content: {
				type: 'youtube-embed',
				url: 'https://www.youtube.com/watch?v=',
				contentType: 'video',
				contentId: ''
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
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('image.default', 'image', 'appearance.opacity'),
					borderRadius: null
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			}
		},
		'spotify-embed': {
			type: 'link',
			bundle: 'spotify-embed',
			content: {
				type: 'spotify-embed',
				url: 'https://open.spotify.com/track/',
				contentType: 'track',
				contentId: '',
				height: 352
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
	}
};

export const mediaNodeMetadata: TNodeMetadata<'media'> = {
	type: 'media',
	label: 'Media',
	bundleMap: {
		image: {
			type: 'media',
			bundle: 'image',
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
	}
};

export const pageNodeMetadata: TNodeMetadata<'page'> = {
	type: 'page',
	label: 'Page',
	bundleMap: {
		default: {
			type: 'page',
			bundle: 'default',
			metadata: {},
			hasWatermark: true,
			children: [],
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
			fill: tokenRef('fill.default', 'fill')
		}
	}
};

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	label: 'Product',
	bundleMap: {
		single: {
			type: 'product',
			bundle: 'single',
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
	}
};

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	label: 'Text',
	bundleMap: {
		default: {
			type: 'text',
			bundle: 'default',
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
	bundleMap: {
		[K in Extract<TFlatNode, { type: GType }>['bundle']]: Omit<
			Extract<TFlatNode, { type: GType; bundle: K }>,
			'id'
		>;
	};
};

import { tokenRef } from '../lib';
import {
	TAboutNode,
	TFlatNode,
	TFlatPageNode,
	TLinkNode,
	TMediaNode,
	TProductNode,
	TTextNode
} from '../types';

export const aboutNodeMetadata: TNodeMetadata<TAboutNode> = {
	type: 'about',
	label: 'About',
	bundleMap: {
		classic: {
			type: 'about',
			bundleType: 'classic',
			content: {
				type: 'basic',
				title: 'Your Name',
				description: 'Tell us about yourself',
				contactLinks: []
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
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
		},
		hero: {
			type: 'about',
			bundleType: 'hero',
			content: {
				type: 'basic',
				title: 'Your Name',
				description: 'Tell us about yourself',
				contactLinks: []
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
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

export const linkNodeMetadata: TNodeMetadata<TLinkNode> = {
	type: 'link',
	label: 'Link',
	bundleMap: {
		'classic': {
			type: 'link',
			bundleType: 'classic',
			content: {
				type: 'basic',
				url: 'https://www.shopify.com/',
				title: 'Add your title here'
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
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
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			}
		},
		'featured': {
			type: 'link',
			bundleType: 'featured',
			content: {
				type: 'basic',
				url: 'https://www.shopify.com/',
				title: 'Add your title here'
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
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
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			}
		},
		'youtube-embed': {
			type: 'link',
			bundleType: 'youtube-embed',
			content: {
				type: 'youtube-embed',
				url: 'https://www.youtube.com/watch?v=',
				contentType: 'video',
				contentId: ''
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			}
		},
		'spotify-embed': {
			type: 'link',
			bundleType: 'spotify-embed',
			content: {
				type: 'spotify-embed',
				url: 'https://open.spotify.com/track/',
				contentType: 'track',
				contentId: '',
				height: 352
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			}
		}
	}
};

export const mediaNodeMetadata: TNodeMetadata<TMediaNode> = {
	type: 'media',
	label: 'Media',
	bundleMap: {
		classic: {
			type: 'media',
			bundleType: 'classic',
			content: {
				type: 'single'
			},
			autoLayout: {
				paddingTop: 0,
				paddingRight: 0,
				paddingBottom: 0,
				paddingLeft: 0,
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			}
		}
	}
};

export const pageNodeMetadata: TNodeMetadata<TFlatPageNode> = {
	type: 'page',
	label: 'Page',
	bundleMap: {
		classic: {
			type: 'page',
			bundleType: 'classic',
			metadata: {},
			hasWatermark: true,
			children: [],
			autoLayout: {
				verticalGap: 24
			},
			appearance: {
				visible: true,
				opacity: 1
			},
			fill: tokenRef('fill.default', 'fill')
		}
	}
};

export const productNodeMetadata: TNodeMetadata<TProductNode> = {
	type: 'product',
	label: 'Product',
	bundleMap: {
		classic: {
			type: 'product',
			bundleType: 'classic',
			content: {
				type: 'single'
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
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
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			},
			productDetails: tokenRef('product-details.default', 'product-details')
		}
	}
};

export const textNodeMetadata: TNodeMetadata<TTextNode> = {
	type: 'text',
	label: 'Text',
	bundleMap: {
		rich: {
			type: 'text',
			bundleType: 'rich',
			content: {
				type: 'rich',
				text: { type: 'markdown', value: 'Add your text here' }
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom')
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

export type TNodeMetadata<GNode extends TFlatNode> = {
	type: GNode['type'];
	label: string;
	bundleMap: {
		[K in GNode['bundleType']]: Omit<Extract<GNode, { bundleType: K }>, 'id'>;
	};
};

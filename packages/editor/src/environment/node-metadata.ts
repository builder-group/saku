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
				paddingTop: 96,
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: 24,
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: null,
			stroke: null,
			shadow: null,
			textHeading: {
				appearance: tokenRef('text.heading', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.heading', 'text', 'typography.font'),
					fontSize: tokenRef('text.heading', 'text', 'typography.fontSize'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('text.heading', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.heading', 'text', 'typography.letterSpacing')
				},
				fill: {
					paint: tokenRef('paint.base200.content', 'paint.solid'),
					opacity: tokenRef('text.heading', 'text', 'fill.opacity')
				},
				stroke: tokenRef('text.heading', 'text', 'stroke'),
				shadow: tokenRef('text.heading', 'text', 'shadow')
			},
			textBody: {
				appearance: tokenRef('text.body', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.body', 'text', 'typography.font'),
					fontSize: tokenRef('text.body', 'text', 'typography.fontSize'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('text.body', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.body', 'text', 'typography.letterSpacing')
				},
				fill: {
					paint: tokenRef('paint.base200.content', 'paint.solid'),
					opacity: tokenRef('text.body', 'text', 'fill.opacity')
				},
				stroke: tokenRef('text.body', 'text', 'stroke'),
				shadow: tokenRef('text.body', 'text', 'shadow')
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
				paddingTop: 0,
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: 24,
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: 0,
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: 0
			},
			appearance: {
				visible: true,
				opacity: 1,
				borderRadius: 0
			},
			fill: null,
			stroke: null,
			shadow: null,
			textHeading: {
				appearance: tokenRef('text.heading', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.heading', 'text', 'typography.font'),
					fontSize: 40,
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('text.heading', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.heading', 'text', 'typography.letterSpacing')
				},
				fill: {
					paint: tokenRef('paint.base200.content', 'paint.solid'),
					opacity: tokenRef('text.heading', 'text', 'fill.opacity')
				},
				stroke: tokenRef('text.heading', 'text', 'stroke'),
				shadow: tokenRef('text.heading', 'text', 'shadow')
			},
			textBody: {
				appearance: tokenRef('text.body', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.body', 'text', 'typography.font'),
					fontSize: tokenRef('text.body', 'text', 'typography.fontSize'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('text.body', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.body', 'text', 'typography.letterSpacing')
				},
				fill: {
					paint: tokenRef('paint.base200.content', 'paint.solid'),
					opacity: tokenRef('text.body', 'text', 'fill.opacity')
				},
				stroke: tokenRef('text.body', 'text', 'stroke'),
				shadow: tokenRef('text.body', 'text', 'shadow')
			}
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
				metadata: {
					title: 'Add your title here'
				},
				overrides: {}
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			textBody: tokenRef('text.body', 'text'),
			textCaption: tokenRef('text.caption', 'text'),
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
				metadata: {
					title: 'Add your title here'
				},
				overrides: {}
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			textBody: tokenRef('text.body', 'text'),
			textCaption: tokenRef('text.caption', 'text'),
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
				paddingTop: 0,
				paddingRight: 0,
				paddingBottom: 0,
				paddingLeft: 0,
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			embed: {
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
				paddingTop: 0,
				paddingRight: 0,
				paddingBottom: 0,
				paddingLeft: 0,
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			embed: {
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
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
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
			watermarkVisible: true,
			children: [],
			content: {
				type: 'basic',
				navbar: {
					visible: true,
					shareButtonVisible: true
				},
				footer: {
					visible: true,
					links: [
						{
							id: 'report',
							action: {
								type: 'footer-report'
							},
							label: 'Report'
						},
						{
							id: 'privacy',
							action: {
								type: 'footer-privacy'
							},
							label: 'Privacy'
						}
					]
				}
			},
			autoLayout: {
				verticalGap: tokenRef('spacing.gap', 'number'),
				paddingTop: tokenRef('spacing.gap', 'number'),
				paddingRight: 0,
				paddingBottom: 0,
				paddingLeft: 0
			},
			appearance: {
				visible: true,
				opacity: 1
			},
			fill: {
				paint: tokenRef('paint.base200', 'paint'),
				opacity: 1
			},
			textCaption: {
				appearance: tokenRef('text.caption', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.caption', 'text', 'typography.font'),
					fontSize: tokenRef('text.caption', 'text', 'typography.fontSize'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('text.caption', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.caption', 'text', 'typography.letterSpacing')
				},
				fill: {
					paint: tokenRef('paint.base200.content', 'paint.solid'),
					opacity: tokenRef('text.caption', 'text', 'fill.opacity')
				},
				stroke: tokenRef('text.caption', 'text', 'stroke'),
				shadow: tokenRef('text.caption', 'text', 'shadow')
			}
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
				type: 'single',
				overrides: {}
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			textBody: {
				appearance: tokenRef('text.body', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.body', 'text', 'typography.font'),
					fontSize: tokenRef('text.body', 'text', 'typography.fontSize'),
					textAlignHorizontal: 'start',
					textAlignVertical: tokenRef('text.body', 'text', 'typography.textAlignVertical'),
					lineHeight: tokenRef('text.body', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.body', 'text', 'typography.letterSpacing')
				},
				fill: tokenRef('text.body', 'text', 'fill'),
				stroke: tokenRef('text.body', 'text', 'stroke'),
				shadow: tokenRef('text.body', 'text', 'shadow')
			},
			buttonPrimary: tokenRef('button.primary', 'button'),
			badgeSecondary: tokenRef('badge.secondary', 'badge'),
			badgeNeutral: tokenRef('badge.neutral', 'badge'),
			banner: tokenRef('banner.default', 'banner'),
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('image.default', 'image', 'appearance.opacity')
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
			},
			productDetails: tokenRef('product-details.default', 'product-details')
		},
		featured: {
			type: 'product',
			bundleType: 'featured',
			content: {
				type: 'single',
				overrides: {}
			},
			autoLayout: {
				paddingTop: tokenRef('auto-layout.default', 'auto-layout', 'paddingTop'),
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: tokenRef('auto-layout.default', 'auto-layout', 'paddingBottom'),
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			textBody: {
				appearance: tokenRef('text.body', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.body', 'text', 'typography.font'),
					fontSize: tokenRef('text.body', 'text', 'typography.fontSize'),
					textAlignHorizontal: 'start',
					textAlignVertical: tokenRef('text.body', 'text', 'typography.textAlignVertical'),
					lineHeight: tokenRef('text.body', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.body', 'text', 'typography.letterSpacing')
				},
				fill: tokenRef('text.body', 'text', 'fill'),
				stroke: tokenRef('text.body', 'text', 'stroke'),
				shadow: tokenRef('text.body', 'text', 'shadow')
			},
			buttonPrimary: tokenRef('button.primary', 'button'),
			badgeSecondary: tokenRef('badge.secondary', 'badge'),
			badgeNeutral: tokenRef('badge.neutral', 'badge'),
			banner: tokenRef('banner.default', 'banner'),
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
		'rich': {
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
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			fill: tokenRef('fill.default', 'fill'),
			stroke: tokenRef('stroke.default', 'stroke'),
			shadow: tokenRef('shadow.default', 'shadow'),
			textBody: tokenRef('text.body', 'text')
		},
		'section-title': {
			type: 'text',
			bundleType: 'section-title',
			content: {
				type: 'basic',
				text: 'Add your title here'
			},
			autoLayout: {
				paddingTop: 24,
				paddingRight: tokenRef('auto-layout.default', 'auto-layout', 'paddingRight'),
				paddingBottom: 0,
				paddingLeft: tokenRef('auto-layout.default', 'auto-layout', 'paddingLeft'),
				marginTop: tokenRef('auto-layout.default', 'auto-layout', 'marginTop'),
				marginRight: tokenRef('auto-layout.default', 'auto-layout', 'marginRight'),
				marginBottom: tokenRef('auto-layout.default', 'auto-layout', 'marginBottom'),
				marginLeft: tokenRef('auto-layout.default', 'auto-layout', 'marginLeft')
			},
			appearance: tokenRef('appearance.default', 'appearance'),
			textHeading: {
				appearance: tokenRef('text.heading', 'text', 'appearance'),
				typography: {
					font: tokenRef('text.heading', 'text', 'typography.font'),
					fontSize: tokenRef('size.text.lg', 'number'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('text.heading', 'text', 'typography.lineHeight'),
					letterSpacing: tokenRef('text.heading', 'text', 'typography.letterSpacing')
				},
				fill: {
					paint: tokenRef('paint.base200.content', 'paint.solid'),
					opacity: tokenRef('text.heading', 'text', 'fill.opacity')
				},
				stroke: tokenRef('text.heading', 'text', 'stroke'),
				shadow: tokenRef('text.heading', 'text', 'shadow')
			}
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

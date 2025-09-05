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
			socialLinks: []
		},
		autoLayout: {
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef(),
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: {
			visible: true,
			opacity: tokenRef(),
			borderRadius: tokenRef()
		},
		fill: null,
		stroke: null,
		shadow: null,
		xlText: {
			appearance: {
				visible: true,
				opacity: tokenRef('xl'),
				borderRadius: undefined
			},
			typography: {
				font: tokenRef('xl'),
				fontSize: tokenRef('xl'),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef('xl'),
				letterSpacing: tokenRef('xl')
			},
			fill: tokenRef('xl'),
			stroke: tokenRef('xl'),
			shadow: tokenRef('xl')
		},
		text: {
			appearance: {
				visible: true,
				opacity: tokenRef(),
				borderRadius: undefined
			},
			typography: {
				font: tokenRef(),
				fontSize: tokenRef(),
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: tokenRef(),
				letterSpacing: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef()
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
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef(),
			horizontalGap: undefined,
			verticalGap: undefined
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
				opacity: tokenRef(),
				borderRadius: undefined
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
		smText: {
			appearance: {
				visible: true,
				opacity: tokenRef('sm'),
				borderRadius: undefined
			},
			typography: {
				font: tokenRef('sm'),
				fontSize: tokenRef('sm'),
				textAlignHorizontal: tokenRef('sm'),
				textAlignVertical: tokenRef('sm'),
				lineHeight: tokenRef('sm'),
				letterSpacing: tokenRef('sm')
			},
			fill: tokenRef('sm'),
			stroke: tokenRef('sm'),
			shadow: tokenRef('sm')
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
		appearance: {
			visible: true,
			opacity: tokenRef(),
			borderRadius: tokenRef()
		},
		fill: tokenRef(),
		stroke: tokenRef(),
		shadow: tokenRef(),
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
			borderRadius: undefined
		},
		fill: tokenRef(),
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
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef(),
			horizontalGap: undefined,
			verticalGap: undefined
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
				opacity: tokenRef(),
				borderRadius: undefined
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
					opacity: tokenRef('primary'),
					borderRadius: undefined
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
					opacity: tokenRef(),
					borderRadius: undefined
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
					opacity: tokenRef(),
					borderRadius: undefined
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
					opacity: tokenRef(),
					borderRadius: undefined
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
						opacity: tokenRef(),
						borderRadius: undefined
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

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	label: 'Text',
	default: {
		content: {
			type: 'default',
			text: { type: 'markdown', value: 'Add your text here' }
		},
		autoLayout: {
			horizontalPadding: tokenRef(),
			verticalPadding: tokenRef(),
			horizontalGap: undefined,
			verticalGap: undefined
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
				opacity: tokenRef(),
				borderRadius: undefined
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
};

export const nodeMetadata = {
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

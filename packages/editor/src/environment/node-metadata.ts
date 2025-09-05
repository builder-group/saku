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
			horizontalPadding: tokenRef('mixin', 'default'),
			verticalPadding: tokenRef('mixin', 'default'),
			horizontalGap: undefined,
			verticalGap: undefined
		},
		appearance: {
			visible: true,
			opacity: tokenRef('mixin', 'default'),
			borderRadius: tokenRef('mixin', 'default')
		},
		fill: null,
		stroke: null,
		shadow: null,
		textXl: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'xl'),
				borderRadius: undefined
			},
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
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: undefined
			},
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
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: tokenRef('mixin', 'default')
			},
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
		appearance: {
			visible: true,
			opacity: tokenRef('mixin', 'default'),
			borderRadius: tokenRef('mixin', 'default')
		},
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: undefined
			},
			typography: {
				font: tokenRef('mixin', 'default'),
				fontSize: tokenRef('mixin', 'default'),
				textAlignHorizontal: tokenRef('mixin', 'default'),
				textAlignVertical: tokenRef('mixin', 'default'),
				lineHeight: tokenRef('mixin', 'default'),
				letterSpacing: tokenRef('mixin', 'default')
			},
			fill: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		},
		textSm: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'sm'),
				borderRadius: undefined
			},
			typography: {
				font: tokenRef('mixin', 'sm'),
				fontSize: tokenRef('mixin', 'sm'),
				textAlignHorizontal: tokenRef('mixin', 'sm'),
				textAlignVertical: tokenRef('mixin', 'sm'),
				lineHeight: tokenRef('mixin', 'sm'),
				letterSpacing: tokenRef('mixin', 'sm')
			},
			fill: tokenRef('mixin', 'sm'),
			stroke: tokenRef('mixin', 'sm'),
			shadow: tokenRef('mixin', 'sm')
		},
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: tokenRef('mixin', 'default')
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
		appearance: {
			visible: true,
			opacity: tokenRef('mixin', 'default'),
			borderRadius: tokenRef('mixin', 'default')
		},
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: tokenRef('mixin', 'default')
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
			borderRadius: undefined
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
		appearance: {
			visible: true,
			opacity: tokenRef('mixin', 'default'),
			borderRadius: tokenRef('mixin', 'default')
		},
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: undefined
			},
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
		buttonPrimary: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'primary'),
				borderRadius: tokenRef('mixin', 'primary')
			},
			fill: tokenRef('mixin', 'primary'),
			stroke: tokenRef('mixin', 'primary'),
			shadow: tokenRef('mixin', 'primary'),
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'primary'),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef('mixin', 'primary'),
					fontSize: tokenRef('mixin', 'primary'),
					textAlignHorizontal: tokenRef('mixin', 'primary'),
					textAlignVertical: tokenRef('mixin', 'primary'),
					lineHeight: tokenRef('mixin', 'primary'),
					letterSpacing: tokenRef('mixin', 'primary')
				},
				fill: tokenRef('mixin', 'primary'),
				stroke: tokenRef('mixin', 'primary'),
				shadow: tokenRef('mixin', 'primary')
			}
		},
		badgePrimary: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'primary'),
				borderRadius: tokenRef('mixin', 'primary')
			},
			fill: tokenRef('mixin', 'primary'),
			stroke: tokenRef('mixin', 'primary'),
			shadow: tokenRef('mixin', 'primary'),
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'primary'),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef('mixin', 'primary'),
					fontSize: tokenRef('mixin', 'primary'),
					textAlignHorizontal: tokenRef('mixin', 'primary'),
					textAlignVertical: tokenRef('mixin', 'primary'),
					lineHeight: tokenRef('mixin', 'primary'),
					letterSpacing: tokenRef('mixin', 'primary')
				},
				fill: tokenRef('mixin', 'primary'),
				stroke: tokenRef('mixin', 'primary'),
				shadow: tokenRef('mixin', 'primary')
			}
		},
		badgeNeutral: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'neutral'),
				borderRadius: tokenRef('mixin', 'neutral')
			},
			fill: tokenRef('mixin', 'neutral'),
			stroke: tokenRef('mixin', 'neutral'),
			shadow: tokenRef('mixin', 'neutral'),
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'neutral'),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef('mixin', 'neutral'),
					fontSize: tokenRef('mixin', 'neutral'),
					textAlignHorizontal: tokenRef('mixin', 'neutral'),
					textAlignVertical: tokenRef('mixin', 'neutral'),
					lineHeight: tokenRef('mixin', 'neutral'),
					letterSpacing: tokenRef('mixin', 'neutral')
				},
				fill: tokenRef('mixin', 'neutral'),
				stroke: tokenRef('mixin', 'neutral'),
				shadow: tokenRef('mixin', 'neutral')
			}
		},
		image: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: tokenRef('mixin', 'default')
			},
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
		},
		productDetails: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: tokenRef('mixin', 'default')
			},
			fill: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default'),
			textXl: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'default'),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef('mixin', 'default'),
					fontSize: tokenRef('mixin', 'default'),
					textAlignHorizontal: tokenRef('mixin', 'default'),
					textAlignVertical: tokenRef('mixin', 'default'),
					lineHeight: tokenRef('mixin', 'default'),
					letterSpacing: tokenRef('mixin', 'default')
				},
				fill: tokenRef('mixin', 'default'),
				stroke: tokenRef('mixin', 'default'),
				shadow: tokenRef('mixin', 'default')
			},
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'default'),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef('mixin', 'default'),
					fontSize: tokenRef('mixin', 'default'),
					textAlignHorizontal: tokenRef('mixin', 'default'),
					textAlignVertical: tokenRef('mixin', 'default'),
					lineHeight: tokenRef('mixin', 'default'),
					letterSpacing: tokenRef('mixin', 'default')
				},
				fill: tokenRef('mixin', 'default'),
				stroke: tokenRef('mixin', 'default'),
				shadow: tokenRef('mixin', 'default')
			},
			buttonPrimary: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'default'),
					borderRadius: tokenRef('mixin', 'default')
				},
				fill: tokenRef('mixin', 'default'),
				stroke: tokenRef('mixin', 'default'),
				shadow: tokenRef('mixin', 'default'),
				text: {
					appearance: {
						visible: true,
						opacity: tokenRef('mixin', 'default'),
						borderRadius: undefined
					},
					typography: {
						font: tokenRef('mixin', 'default'),
						fontSize: tokenRef('mixin', 'default'),
						textAlignHorizontal: tokenRef('mixin', 'default'),
						textAlignVertical: tokenRef('mixin', 'default'),
						lineHeight: tokenRef('mixin', 'default'),
						letterSpacing: tokenRef('mixin', 'default')
					},
					fill: tokenRef('mixin', 'default'),
					stroke: tokenRef('mixin', 'default'),
					shadow: tokenRef('mixin', 'default')
				}
			},
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('mixin', 'default'),
					borderRadius: tokenRef('mixin', 'default')
				},
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
		appearance: {
			visible: true,
			opacity: tokenRef('mixin', 'default'),
			borderRadius: tokenRef('mixin', 'default')
		},
		fill: tokenRef('mixin', 'default'),
		stroke: tokenRef('mixin', 'default'),
		shadow: tokenRef('mixin', 'default'),
		text: {
			appearance: {
				visible: true,
				opacity: tokenRef('mixin', 'default'),
				borderRadius: undefined
			},
			typography: {
				font: tokenRef('mixin', 'default'),
				fontSize: tokenRef('mixin', 'default'),
				textAlignHorizontal: tokenRef('mixin', 'default'),
				textAlignVertical: tokenRef('mixin', 'default'),
				lineHeight: tokenRef('mixin', 'default'),
				letterSpacing: tokenRef('mixin', 'default')
			},
			fill: tokenRef('mixin', 'default'),
			stroke: tokenRef('mixin', 'default'),
			shadow: tokenRef('mixin', 'default')
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
	default: Omit<Extract<TFlatNode, { type: GType }>, 'id' | 'type'>;
};

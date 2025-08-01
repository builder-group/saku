import { inheritStyle, TFlatNode } from '@repo/editor';
import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@/components';

export const nodeMetadataMap: TNodeMetadataMap = {
	page: {
		type: 'page',
		internal: true
	},
	about: {
		type: 'about',
		icon: LayoutSectionIcon,
		label: 'About',
		internal: false,
		defaultData: {
			content: {
				name: 'Your Name',
				bio: 'Tell us about yourself',
				socialLinks: []
			},
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle(),
				font: inheritStyle(),
				fontSize: inheritStyle(),
				textColor: inheritStyle(),
				textAlign: inheritStyle(),
				borderRadius: inheritStyle(),
				shadow: inheritStyle()
			}
		}
	},
	link: {
		type: 'link',
		icon: LayoutSectionIcon,
		label: 'Link',
		internal: false,
		defaultData: {
			content: {
				url: 'https://www.shopify.com/',
				variant: {
					type: 'default',
					userTitle: 'Add your title here'
				}
			},
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle(),
				font: inheritStyle(),
				fontSize: inheritStyle(),
				textColor: inheritStyle(),
				textAlign: inheritStyle(),
				borderRadius: inheritStyle(),
				shadow: inheritStyle()
			}
		}
	},
	media: {
		type: 'media',
		icon: LayoutSectionIcon,
		label: 'Media',
		internal: false,
		defaultData: {
			content: {},
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle(),
				borderRadius: inheritStyle(),
				shadow: inheritStyle()
			}
		}
	},
	text: {
		type: 'text',
		icon: LayoutSectionIcon,
		label: 'Text',
		internal: false,
		defaultData: {
			content: {
				text: 'Add your text here'
			},
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle(),
				font: inheritStyle(),
				fontSize: inheritStyle(),
				textColor: inheritStyle(),
				textAlign: inheritStyle(),
				borderRadius: inheritStyle(),
				shadow: inheritStyle()
			}
		}
	},
	product: {
		type: 'product',
		icon: LayoutSectionIcon,
		label: 'Product',
		internal: false,
		defaultData: {
			content: {},
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle(),
				font: inheritStyle(),
				fontSize: inheritStyle(),
				textColor: inheritStyle(),
				borderRadius: inheritStyle(),
				shadow: inheritStyle()
			}
		}
	}
};

export const nodeMetadata = Object.values(nodeMetadataMap);

export type TNodeMetadataMap = {
	[K in Extract<TFlatNode, { type: string }>['type']]: TNodeMetadata<K>;
};

export type TNodeMetadata<GType extends TFlatNode['type']> = {
	type: GType;
	hidden?: boolean;
} & (
	| {
			internal: false;
			icon: IconSource;
			label: string;
			defaultData: Omit<Extract<TFlatNode, { type: GType }>, 'id' | 'type'>;
	  }
	| { internal: true; defaultData?: Omit<Extract<TFlatNode, { type: GType }>, 'id' | 'type'> }
);

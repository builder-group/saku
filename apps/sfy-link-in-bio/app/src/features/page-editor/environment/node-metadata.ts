import { inheritStyle, TNode } from '@repo/editor';
import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@/components';
import { appConfig } from '@/environment';

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
			name: 'Your Name',
			bio: 'Tell us about yourself',
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
			url: 'https://example.com',
			meta: {
				title: 'New Link'
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
			media: {
				type: 'image' as const,
				hash: ''
			},
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
			text: 'Add your text here',
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
		hidden: appConfig.env !== 'development',
		defaultData: {
			productId: '',
			variantIds: [],
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle()
			}
		}
	}
};

export const nodeMetadata = Object.values(nodeMetadataMap);

export type TNodeMetadataMap = {
	[K in Extract<TNode, { type: string }>['type']]: TNodeMetadata<K>;
};

export type TNodeMetadata<GType extends TNode['type']> = {
	type: GType;
	hidden?: boolean;
} & (
	| {
			internal: false;
			icon: IconSource;
			label: string;
			defaultData: Omit<Extract<TNode, { type: GType }>, 'id' | 'type'>;
	  }
	| { internal: true; defaultData?: Omit<Extract<TNode, { type: GType }>, 'id' | 'type'> }
);

import { inheritStyle, TNode, TNodeType } from '@repo/editor';
import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@/components';
import { appConfig } from '@/environment';

export const nodeMetadataMap = {
	page: {
		type: 'page',
		internal: true
	} satisfies TNodeMetadata<'page'>,
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
	} satisfies TNodeMetadata<'about'>,
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
	} satisfies TNodeMetadata<'link'>,
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
	} satisfies TNodeMetadata<'media'>,
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
	} satisfies TNodeMetadata<'text'>,
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
	} satisfies TNodeMetadata<'product'>,
	promised: {
		type: 'promised',
		internal: true
	} satisfies TNodeMetadata<'promised'>
} as Record<TNodeType, TNodeMetadata<TNodeType>>;

export const nodeMetadata = Object.values(nodeMetadataMap);

export type TNodeMetadata<GType extends TNodeType> = {
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

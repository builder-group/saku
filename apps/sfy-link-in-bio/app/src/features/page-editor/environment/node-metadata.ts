import { hexToRgba, inheritStyle, TNode, TNodeType } from '@repo/editor';
import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@/components';

export const nodeMetadataMap = {
	page: {
		type: 'page',
		icon: LayoutSectionIcon,
		label: 'Page',
		hidden: true,
		defaultData: {
			children: [],
			style: {
				backgroundColor: hexToRgba('#F8F9FA'),
				children: {
					backgroundColor: hexToRgba('#FFFFFF'),
					spacing: 16,
					padding: 16,
					font: {
						family: 'Inter',
						weight: 400,
						style: 'normal'
					},
					fontSize: 16,
					textColor: hexToRgba('#2F4F4F'),
					textAlign: 'center' as const,
					borderRadius: 12,
					shadow: true
				}
			}
		}
	} satisfies TNodeMetadata<'page'>,
	about: {
		type: 'about',
		icon: LayoutSectionIcon,
		label: 'About',
		hidden: false,
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
		hidden: false,
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
		hidden: false,
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
		hidden: false,
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
	} satisfies TNodeMetadata<'text'>
} as const;

export const nodeMetadata = Object.values(nodeMetadataMap);

export interface TNodeMetadata<GType extends TNodeType> {
	type: GType;
	icon: IconSource;
	label: string;
	hidden: boolean;
	defaultData: Omit<Extract<TNode, { type: GType }>, 'id' | 'type'>;
}

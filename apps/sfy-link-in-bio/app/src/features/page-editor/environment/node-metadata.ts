import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@/components';
import { TNode, TNodeType } from '../types';

export const nodeMetadataMap = {
	page: {
		type: 'page',
		icon: LayoutSectionIcon,
		label: 'Page',
		hidden: true,
		defaultData: {
			children: [],
			style: {
				backgroundColor: '#F8F9FA',
				children: {
					backgroundColor: '#FFFFFF',
					spacing: 16,
					padding: 16,
					margin: 8,
					fontFamily: 'Inter',
					fontSize: 16,
					textColor: '#2F4F4F',
					textAlign: 'center' as const,
					borderRadius: 12,
					shadow: true
				}
			}
		}
	} satisfies TNodeMetadata<'page'>,
	site: {
		type: 'site',
		icon: LayoutSectionIcon,
		label: 'Site',
		hidden: true,
		defaultData: {
			version: 'v0.0.1' as const,
			children: []
		}
	} satisfies TNodeMetadata<'site'>,
	about: {
		type: 'about',
		icon: LayoutSectionIcon,
		label: 'About',
		hidden: false,
		defaultData: {
			name: 'Your Name',
			bio: 'Tell us about yourself',
			media: {
				type: 'image' as const,
				url: ''
			},
			style: {
				padding: 'inherit' as const,
				margin: 'inherit' as const,
				backgroundColor: 'inherit' as const,
				fontFamily: 'inherit' as const,
				fontSize: 'inherit' as const,
				textColor: 'inherit' as const,
				textAlign: 'inherit' as const,
				borderRadius: 'inherit' as const,
				shadow: 'inherit' as const
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
				padding: 'inherit' as const,
				margin: 'inherit' as const,
				backgroundColor: 'inherit' as const,
				fontFamily: 'inherit' as const,
				fontSize: 'inherit' as const,
				textColor: 'inherit' as const,
				textAlign: 'inherit' as const,
				borderRadius: 'inherit' as const,
				shadow: 'inherit' as const
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
				url: ''
			},
			style: {
				padding: 'inherit' as const,
				margin: 'inherit' as const,
				backgroundColor: 'inherit' as const,
				borderRadius: 'inherit' as const,
				shadow: 'inherit' as const
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
				padding: 'inherit' as const,
				margin: 'inherit' as const,
				backgroundColor: 'inherit' as const,
				fontFamily: 'inherit' as const,
				fontSize: 'inherit' as const,
				textColor: 'inherit' as const,
				textAlign: 'inherit' as const,
				borderRadius: 'inherit' as const,
				shadow: 'inherit' as const
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

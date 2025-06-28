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
			children: []
		}
	} satisfies TNodeMetadata<'page'>,
	site: {
		type: 'site',
		icon: LayoutSectionIcon,
		label: 'Site',
		hidden: true,
		defaultData: {
			version: 'v0.0.1',
			children: []
		}
	} satisfies TNodeMetadata<'site'>,
	about: {
		type: 'about',
		icon: LayoutSectionIcon,
		label: 'About',
		hidden: false,
		defaultData: {
			name: '',
			bio: '',
			avatarUrl: ''
		}
	} satisfies TNodeMetadata<'about'>,
	link: {
		type: 'link',
		icon: LayoutSectionIcon,
		label: 'Link',
		hidden: false,
		defaultData: {
			url: ''
		}
	} satisfies TNodeMetadata<'link'>,
	media: {
		type: 'media',
		icon: LayoutSectionIcon,
		label: 'Media',
		hidden: false,
		defaultData: {
			media: {
				type: 'image',
				url: '',
				altText: ''
			}
		}
	} satisfies TNodeMetadata<'media'>,
	text: {
		type: 'text',
		icon: LayoutSectionIcon,
		label: 'Text',
		hidden: false,
		defaultData: {
			text: '',
			alignment: 'center' as const
		}
	} satisfies TNodeMetadata<'text'>
} as const;

export interface TNodeMetadata<GType extends TNodeType> {
	type: GType;
	icon: IconSource;
	label: string;
	hidden: boolean;
	defaultData: Omit<Extract<TNode, { type: GType }>, 'id' | 'type'>;
}

export const nodeMetadata = Object.values(nodeMetadataMap);

export function getNodeMetadata<GType extends TNodeType>(type: GType): TNodeMetadata<GType> {
	return nodeMetadataMap[type] as unknown as TNodeMetadata<GType>;
}

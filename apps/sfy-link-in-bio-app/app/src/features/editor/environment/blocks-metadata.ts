import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@/components';
import { TBlock, TBlockType } from '../types';

export const blocksMetadataMap = {
	about: {
		type: 'about',
		icon: LayoutSectionIcon,
		label: 'About',
		defaultData: {
			name: '',
			bio: '',
			avatarUrl: ''
		}
	} satisfies TBlockMetadata<'about'>,
	link: {
		type: 'link',
		icon: LayoutSectionIcon,
		label: 'Link',
		defaultData: {
			url: ''
		}
	} satisfies TBlockMetadata<'link'>,
	media: {
		type: 'media',
		icon: LayoutSectionIcon,
		label: 'Media',
		defaultData: {
			media: {
				type: 'image',
				url: '',
				altText: ''
			}
		}
	} satisfies TBlockMetadata<'media'>,
	text: {
		type: 'text',
		icon: LayoutSectionIcon,
		label: 'Text',
		defaultData: {
			text: '',
			alignment: 'center' as const
		}
	} satisfies TBlockMetadata<'text'>
} as const;

export interface TBlockMetadata<T extends TBlockType> {
	type: T;
	icon: IconSource;
	label: string;
	defaultData: Omit<Extract<TBlock, { type: T }>, 'id' | 'type' | 'styles'>;
}

export const blocksMetadata = Object.values(blocksMetadataMap);

export function getBlockMetadata<GType extends TBlockType>(type: GType): TBlockMetadata<GType> {
	return blocksMetadataMap[type] as unknown as TBlockMetadata<GType>;
}

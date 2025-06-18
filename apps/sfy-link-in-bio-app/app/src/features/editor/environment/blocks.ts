import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@shopify/polaris-icons';

// ============================================================================
// Block Metadata
// ============================================================================

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

// ============================================================================
// Block Types
// ============================================================================

export type TBlockId = string;
export type TBlock = TAboutBlock | TLinkBlock | TMediaBlock | TTextBlock;
export type TBlockType = TBlock['type'];

export interface TBlockBase {
	id: TBlockId;
	type: string;
	styles: Record<string, string>;
}

export interface TAboutBlock extends TBlockBase {
	type: 'about';
	name: string;
	bio?: string;
	avatarUrl?: string;
}

export interface TLinkBlock extends TBlockBase {
	type: 'link';
	url: string;
	meta?: TLinkMeta;
	customMeta?: TLinkMeta;
}

export interface TLinkMeta {
	title?: string;
	faviconUrl?: string;
	imageUrl?: string;
}

export interface TMediaBlock extends TBlockBase {
	type: 'media';
	media: TMedia;
}

export type TMedia = TImageMedia;

export interface TImageMedia {
	type: 'image';
	url: string;
	mimeType?: string;
	fileName?: string;
	altText?: string;
	previewImageUrl?: string;
}

export interface TTextBlock extends TBlockBase {
	type: 'text';
	title?: string;
	text: string;
	alignment: 'left' | 'center' | 'right';
}

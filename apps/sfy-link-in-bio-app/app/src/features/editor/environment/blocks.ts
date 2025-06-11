import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon } from '@shopify/polaris-icons';

export const blocksMetadataMap = {
	header: {
		type: 'header',
		icon: LayoutSectionIcon,
		label: 'Header'
	} satisfies TBlockMetadata,
	link: {
		type: 'link',
		icon: LayoutSectionIcon,
		label: 'Link'
	} satisfies TBlockMetadata,
	media: {
		type: 'media',
		icon: LayoutSectionIcon,
		label: 'Media'
	} satisfies TBlockMetadata
};

interface TBlockMetadata {
	type: string;
	icon: IconSource;
	label: string;
}

export type TBlock = THeaderBlock | TLinkBlock | TMediaBlock;

export interface THeaderBlock {
	id: TBlockId;
	type: 'header';
}

export interface TLinkBlock {
	id: TBlockId;
	type: 'link';
}

export interface TMediaBlock {
	id: TBlockId;
	type: 'media';
}

export type TBlockId = string;

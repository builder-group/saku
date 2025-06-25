import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon, SettingsIcon } from '@/components';

export const viewsMetadataMap = {
	blocks: {
		type: 'blocks',
		icon: LayoutSectionIcon,
		label: 'Blocks'
	} satisfies TViewMetadata,
	settings: {
		type: 'settings',
		icon: SettingsIcon,
		label: 'Settings'
	} satisfies TViewMetadata
};

export type TViewType = keyof typeof viewsMetadataMap;

export interface TViewMetadata {
	type: string;
	icon: IconSource;
	label: string;
}

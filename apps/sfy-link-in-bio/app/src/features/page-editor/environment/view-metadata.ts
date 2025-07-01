import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon, SettingsIcon } from '@/components';

export const viewMetadataMap = {
	layers: {
		type: 'layers',
		icon: LayoutSectionIcon,
		label: 'Layers'
	} satisfies TViewMetadata,
	settings: {
		type: 'settings',
		icon: SettingsIcon,
		label: 'Settings'
	} satisfies TViewMetadata
};

export type TViewType = keyof typeof viewMetadataMap;

export interface TViewMetadata {
	type: string;
	icon: IconSource;
	label: string;
}

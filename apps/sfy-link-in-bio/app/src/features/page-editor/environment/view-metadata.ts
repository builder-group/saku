import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon, SettingsIcon, ViewIcon } from '@/components';

export const viewMetadataMap = {
	layers: {
		type: 'layers',
		icon: LayoutSectionIcon,
		label: 'Layers'
	} satisfies TViewMetadata,
	preview: {
		type: 'preview',
		icon: ViewIcon,
		label: 'Preview'
	} satisfies TViewMetadata,
	settings: {
		type: 'settings',
		icon: SettingsIcon,
		label: 'Settings'
	} satisfies TViewMetadata
};

export const viewMetadata = Object.values(viewMetadataMap);

export type TViewType = keyof typeof viewMetadataMap;

export interface TViewMetadata {
	type: string;
	icon: IconSource;
	label: string;
}

import { IconSource } from '@shopify/polaris';
import { PolarisLayoutSectionIcon, PolarisSettingsIcon, PolarisViewIcon } from '@/components';

export const viewMetadataMap = {
	layers: {
		type: 'layers',
		icon: PolarisLayoutSectionIcon,
		label: 'Layers'
	} satisfies TViewMetadata,
	preview: {
		type: 'preview',
		icon: PolarisViewIcon,
		label: 'Preview'
	} satisfies TViewMetadata,
	settings: {
		type: 'settings',
		icon: PolarisSettingsIcon,
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

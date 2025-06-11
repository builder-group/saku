import { IconSource } from '@shopify/polaris';
import { LayoutSectionIcon, SettingsIcon } from '@/components';

export const views = {
	blocks: {
		id: 'blocks',
		icon: LayoutSectionIcon,
		label: 'Blocks'
	} satisfies TView,
	settings: {
		id: 'settings',
		icon: SettingsIcon,
		label: 'Settings'
	} satisfies TView
};

export type TViewId = keyof typeof views;

export interface TView {
	id: string;
	icon: IconSource;
	label: string;
}

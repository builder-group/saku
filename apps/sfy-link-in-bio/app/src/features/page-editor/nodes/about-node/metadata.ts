import { aboutNodeMetadata as editorAboutNodeMetadata } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const aboutNodeMetadata: TNodeMetadata<'about'> = {
	type: 'about',
	icon: PolarisLayoutSectionIcon,
	label: editorAboutNodeMetadata.label,
	internal: false,
	defaultBundle: editorAboutNodeMetadata.bundleMap.default
};

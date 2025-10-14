import { aboutNodeMetadata as editorAboutNodeMetadata, TAboutNode } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../../lib';

export const aboutNodeMetadata: TNodeMetadata<TAboutNode> = {
	type: 'about',
	icon: PolarisLayoutSectionIcon,
	label: editorAboutNodeMetadata.label,
	internal: false,
	defaultBundle: editorAboutNodeMetadata.bundleMap.classic
};

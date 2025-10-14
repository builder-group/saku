import { mediaNodeMetadata as editorMediaNodeMetadata, TMediaNode } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const mediaNodeMetadata: TNodeMetadata<TMediaNode> = {
	type: 'media',
	icon: PolarisLayoutSectionIcon,
	label: editorMediaNodeMetadata.label,
	internal: false,
	defaultBundle: editorMediaNodeMetadata.bundleMap.classic
};

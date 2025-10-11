import { textNodeMetadata as editorTextNodeMetadata } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib/node/types';

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	icon: PolarisLayoutSectionIcon,
	label: editorTextNodeMetadata.label,
	internal: false,
	defaultBundle: editorTextNodeMetadata.bundleMap.rich
};

import { textNodeMetadata as editorTextNodeMetadata, TTextNode } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib/node/types';

export const textNodeMetadata: TNodeMetadata<TTextNode> = {
	type: 'text',
	icon: PolarisLayoutSectionIcon,
	label: editorTextNodeMetadata.label,
	internal: false,
	defaultBundle: editorTextNodeMetadata.bundleMap.rich
};

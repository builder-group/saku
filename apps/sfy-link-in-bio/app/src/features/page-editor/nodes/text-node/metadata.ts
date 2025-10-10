import { textNodeMetadata as editorTextNodeMetadatad } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib/node/types';

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	icon: PolarisLayoutSectionIcon,
	label: editorTextNodeMetadatad.label,
	internal: false,
	default: editorTextNodeMetadatad.compositions.default
};

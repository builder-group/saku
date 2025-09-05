import { textNodeMetadata as editorTextNodeMetadatad } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib/node/types';

export const textNodeMetadata: TNodeMetadata<'text'> = {
	type: 'text',
	icon: LayoutSectionIcon,
	label: editorTextNodeMetadatad.label,
	internal: false,
	default: editorTextNodeMetadatad.default
};

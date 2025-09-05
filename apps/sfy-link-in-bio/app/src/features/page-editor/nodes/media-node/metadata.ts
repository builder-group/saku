import { mediaNodeMetadata as editorMediaNodeMetadata } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const mediaNodeMetadata: TNodeMetadata<'media'> = {
	type: 'media',
	icon: LayoutSectionIcon,
	label: editorMediaNodeMetadata.label,
	internal: false,
	default: editorMediaNodeMetadata.default
};

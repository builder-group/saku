import { mediaNodeMetadata as editorMediaNodeMetadata } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const mediaNodeMetadata: TNodeMetadata<'media'> = {
	type: 'media',
	icon: PolarisLayoutSectionIcon,
	label: editorMediaNodeMetadata.label,
	internal: false,
	default: editorMediaNodeMetadata.compositions.image
};

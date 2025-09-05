import { aboutNodeMetadata as editorAboutNodeMetadata } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const aboutNodeMetadata: TNodeMetadata<'about'> = {
	type: 'about',
	icon: LayoutSectionIcon,
	label: editorAboutNodeMetadata.label,
	internal: false,
	default: editorAboutNodeMetadata.default
};

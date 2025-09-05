import { linkNodeMetadata as editorLinkNodeMetadata } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	icon: LayoutSectionIcon,
	label: editorLinkNodeMetadata.label,
	internal: false,
	default: editorLinkNodeMetadata.default
};

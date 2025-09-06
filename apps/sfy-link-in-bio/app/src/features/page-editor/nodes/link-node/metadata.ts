import { linkNodeMetadata as editorLinkNodeMetadata } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const linkNodeMetadata: TNodeMetadata<'link'> = {
	type: 'link',
	icon: PolarisLayoutSectionIcon,
	label: editorLinkNodeMetadata.label,
	internal: false,
	default: editorLinkNodeMetadata.default
};

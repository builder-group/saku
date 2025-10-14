import { linkNodeMetadata as editorLinkNodeMetadata, TLinkNode } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../../lib';

export const linkNodeMetadata: TNodeMetadata<TLinkNode> = {
	type: 'link',
	icon: PolarisLayoutSectionIcon,
	label: editorLinkNodeMetadata.label,
	internal: false,
	defaultBundle: editorLinkNodeMetadata.bundleMap.classic
};

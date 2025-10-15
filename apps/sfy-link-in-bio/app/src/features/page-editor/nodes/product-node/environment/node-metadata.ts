import { productNodeMetadata as editorProductNodeMetadata, TProductNode } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../../lib';

export const productNodeMetadata: TNodeMetadata<TProductNode> = {
	type: 'product',
	icon: PolarisLayoutSectionIcon,
	label: editorProductNodeMetadata.label,
	internal: false,
	defaultBundle: editorProductNodeMetadata.bundleMap.classic
};

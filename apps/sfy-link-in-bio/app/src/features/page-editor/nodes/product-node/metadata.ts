import { productNodeMetadata as editorProductNodeMetadata } from '@repo/editor';
import { LayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	icon: LayoutSectionIcon,
	label: editorProductNodeMetadata.label,
	internal: false,
	default: editorProductNodeMetadata.default
};

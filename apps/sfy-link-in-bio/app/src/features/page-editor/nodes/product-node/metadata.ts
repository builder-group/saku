import { productNodeMetadata as editorProductNodeMetadata } from '@repo/editor';
import { PolarisLayoutSectionIcon } from '@/components';
import { TNodeMetadata } from '../../lib';

export const productNodeMetadata: TNodeMetadata<'product'> = {
	type: 'product',
	icon: PolarisLayoutSectionIcon,
	label: editorProductNodeMetadata.label,
	internal: false,
	default: editorProductNodeMetadata.compositions.single
};

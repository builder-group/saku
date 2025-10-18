import { pageNodeMetadata as editorPageNodeMetadata, TFlatPageNode } from '@repo/editor';
import { TNodeMetadata } from '../../../lib';

export const pageNodeMetadata: TNodeMetadata<TFlatPageNode> = {
	type: 'page',
	internal: true,
	defaultBundle: editorPageNodeMetadata.bundleMap.classic
};

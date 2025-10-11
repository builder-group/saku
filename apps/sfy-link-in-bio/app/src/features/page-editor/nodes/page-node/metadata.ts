import { pageNodeMetadata as editorPageNodeMetadata } from '@repo/editor';
import { TNodeMetadata } from '../../lib';

export const pageNodeMetadata: TNodeMetadata<'page'> = {
	type: 'page',
	internal: true,
	defaultBundle: editorPageNodeMetadata.bundleMap.classic
};

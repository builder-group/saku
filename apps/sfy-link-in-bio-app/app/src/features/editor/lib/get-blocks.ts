import { TBlock, TSiteNode } from '../types';

export function getBlocks(siteNode: TSiteNode): TBlock[] | null {
	const pageNode = siteNode.children[0];
	if (pageNode == null || pageNode.type !== 'page') {
		return null;
	}
	return pageNode.blocks;
}

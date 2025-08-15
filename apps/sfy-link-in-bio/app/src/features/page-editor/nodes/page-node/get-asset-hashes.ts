import { getFontHash, TAssetHash, TFlatPageNode } from '@repo/editor';

/**
 * Extracts asset hashes from a page node
 */
export function getPageNodeAssetHashes(node: TFlatPageNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset
	if (node.childMixins?.typography?.font != null) {
		hashes.push(getFontHash(node.childMixins.typography.font));
	}

	// Metadata image asset
	if (node.content.metadata?.image != null) {
		hashes.push(node.content.metadata.image);
	}

	return hashes;
}

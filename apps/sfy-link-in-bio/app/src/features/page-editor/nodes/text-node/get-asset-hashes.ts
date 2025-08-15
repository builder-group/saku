import { getFontHash, isInherited, TAssetHash, TTextNode } from '@repo/editor';

/**
 * Extracts asset hashes from a text node
 */
export function getTextNodeAssetHashes(node: TTextNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset (if not inherited)
	if (node.typography?.font != null && !isInherited(node.typography.font)) {
		hashes.push(getFontHash(node.typography.font));
	}

	return hashes;
}

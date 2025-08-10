import { getFontHash, isInheritedStyle, TAssetHash, TTextNode } from '@repo/editor';

/**
 * Extracts asset hashes from a text node
 */
export function getTextNodeAssetHashes(node: TTextNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset (if not inherited)
	if (node.style?.font != null && !isInheritedStyle(node.style.font)) {
		hashes.push(getFontHash(node.style.font));
	}

	return hashes;
}

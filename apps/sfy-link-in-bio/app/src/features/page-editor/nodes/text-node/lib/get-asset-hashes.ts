import { getFontHash, isTokenRef, TAssetHash, TTextNode } from '@repo/editor';

/**
 * Extracts asset hashes from a text node
 */
export function getTextNodeAssetHashes(node: TTextNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset (if not linked)
	if (
		'text' in node &&
		!isTokenRef(node.text) &&
		!isTokenRef(node.text.typography) &&
		!isTokenRef(node.text.typography.font)
	) {
		hashes.push(getFontHash(node.text.typography.font));
	}
	if (
		'textXl' in node &&
		!isTokenRef(node.textXl) &&
		!isTokenRef(node.textXl.typography) &&
		!isTokenRef(node.textXl.typography.font)
	) {
		hashes.push(getFontHash(node.textXl.typography.font));
	}

	// Fill asset (if not linked)
	if (
		'fill' in node &&
		!isTokenRef(node.fill) &&
		node.fill?.paint.type === 'image' &&
		node.fill.paint.hash != null
	) {
		hashes.push(node.fill.paint.hash);
	}

	return hashes;
}

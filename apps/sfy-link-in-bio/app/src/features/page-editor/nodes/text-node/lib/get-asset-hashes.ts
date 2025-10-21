import { getFontHash, isTokenRef, TAssetHash, TTextNode } from '@repo/editor';

/**
 * Extracts asset hashes from a text node
 */
export function getTextNodeAssetHashes(node: TTextNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset (if not linked)
	if (
		'textHeading' in node &&
		!isTokenRef(node.textHeading) &&
		!isTokenRef(node.textHeading.typography) &&
		!isTokenRef(node.textHeading.typography.font)
	) {
		hashes.push(getFontHash(node.textHeading.typography.font));
	}
	if (
		'textBody' in node &&
		!isTokenRef(node.textBody) &&
		!isTokenRef(node.textBody.typography) &&
		!isTokenRef(node.textBody.typography.font)
	) {
		hashes.push(getFontHash(node.textBody.typography.font));
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

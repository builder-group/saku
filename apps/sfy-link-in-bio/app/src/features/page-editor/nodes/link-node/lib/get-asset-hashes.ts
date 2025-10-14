import { getFontHash, isTokenRef, TAssetHash, TLinkNode } from '@repo/editor';

/**
 * Extracts asset hashes from a link node
 */
export function getLinkNodeAssetHashes(node: TLinkNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Thumbnail asset
	switch (node.content.type) {
		case 'basic': {
			if (node.content.userThumbnail != null) {
				hashes.push(node.content.userThumbnail);
			}
			if (node.content.thumbnail != null) {
				hashes.push(node.content.thumbnail);
			}
			break;
		}
		default:
		// do nothing
	}

	// Font asset (if not linked)
	if (
		'text' in node &&
		!isTokenRef(node.text) &&
		!isTokenRef(node.text.typography) &&
		!isTokenRef(node.text.typography.font)
	) {
		hashes.push(getFontHash(node.text.typography.font));
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

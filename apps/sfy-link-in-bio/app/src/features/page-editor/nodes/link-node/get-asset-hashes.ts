import { getFontHash, isTokenRef, TAssetHash, TLinkNode } from '@repo/editor';

/**
 * Extracts asset hashes from a link node
 */
export function getLinkNodeAssetHashes(node: TLinkNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Image asset
	switch (node.content.type) {
		case 'basic': {
			if (node.content.userImage != null) {
				hashes.push(node.content.userImage);
			}
			if (node.content.image != null) {
				hashes.push(node.content.image);
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

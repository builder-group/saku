import { getFontHash, isTokenRef, TAssetHash, TLinkNode } from '@repo/editor';

/**
 * Extracts asset hashes from a link node
 */
export function getLinkNodeAssetHashes(node: TLinkNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Favicon asset
	switch (node.content.variant.type) {
		case 'default': {
			if (node.content.variant.userFavicon != null) {
				hashes.push(node.content.variant.userFavicon);
			}
			if (node.content.variant.favicon != null) {
				hashes.push(node.content.variant.favicon);
			}
			break;
		}
		default:
		// do nothing
	}

	// Font asset (if not linked)
	if (!isTokenRef(node.text.typography) && !isTokenRef(node.text.typography.font)) {
		hashes.push(getFontHash(node.text.typography.font));
	}

	// Fill asset (if not linked)
	if (!isTokenRef(node.fill) && node.fill?.paint.type === 'image' && node.fill.paint.hash != null) {
		hashes.push(node.fill.paint.hash);
	}

	return hashes;
}

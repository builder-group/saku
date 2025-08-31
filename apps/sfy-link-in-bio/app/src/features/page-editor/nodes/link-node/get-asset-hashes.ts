import { getFontHash, isTokenRef, TAssetHash, TLinkNode } from '@repo/editor';

/**
 * Extracts asset hashes from a link node
 */
export function getLinkNodeAssetHashes(node: TLinkNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Favicon asset
	switch (node.content.type) {
		case 'single': {
			if (node.content.userFavicon != null) {
				hashes.push(node.content.userFavicon);
			}
			if (node.content.favicon != null) {
				hashes.push(node.content.favicon);
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
